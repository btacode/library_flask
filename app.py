from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'library_001'

mysql = MySQL(app)
 
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')     
    role = data.get('role', 'user')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, role) VALUES (%s, %s, %s)", (username, password, role))

    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/users', methods=['GET'])
def get_users():    
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, role FROM users")
    users = cur.fetchall()
    cur.close()
 
    return jsonify([{'id': user[0], 'username': user[1], 'role': user[2]} for user in users]), 200


@app.route('/login', methods=['POST'])
def login_user():
    cookie = request.cookies.get('session_id')
    if cookie:
        return jsonify({'message': 'Already logged in'}), 200
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, role FROM users WHERE username = %s AND password = %s", (username, password))
    user = cur.fetchone()
    cur.close()

    if user:
        response = jsonify({
            'message': 'Login successful',
            'user_id': user[0],
            'role': user[1],
            'username': username
        })

        response.set_cookie(
            'session_id',
            str(user[0]),
            httponly=True,
            samesite='Lax',
            secure=False      # Change to True when you deploy with HTTPS
        )

        return response, 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
    
@app.route('/logout', methods=['POST'])
def logout_user():
    response = jsonify({'message': 'Logged out successfully'})
    response.delete_cookie('session_id')
    return response, 200

@app.route('/check_auth', methods=['GET'])
def check_auth():
    session_id = request.cookies.get('session_id')
    if not session_id:
        return jsonify({'authenticated': False}), 401

    cur = mysql.connection.cursor()
    cur.execute("SELECT username, role FROM users WHERE id = %s", (session_id,))
    user = cur.fetchone()
    cur.close()

    if user:
        return jsonify({'authenticated': True, 'username': user[0], 'role': user[1]}), 200
    else:
        return jsonify({'authenticated': False}), 401


@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    publishing_year = data.get('publishing_year')

    if not title or not author or not publishing_year:
        return jsonify({'error': 'Title, author, and publishing year are required'}), 400
    
    if not request.cookies.get('session_id'):
        return jsonify({'error': 'User not logged in'}), 401
   
    cur = mysql.connection.cursor()
    # Check if the user is an admin  
    cur.execute("SELECT role FROM users WHERE id = %s", (request.cookies.get('session_id'),))
    user = cur.fetchone()   
    if not user or user[0] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
  
    book = cur.execute("SELECT * FROM books WHERE title = %s AND author = %s", (title, author))
    if book:
        return jsonify({'error': 'Book already exists'}), 400
    
    cur.execute(
        "INSERT INTO books (title, author, publishing_year) VALUES (%s, %s, %s)",
        (title, author, publishing_year)
    )
  
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Book added successfully'}), 201

@app.route('/books', methods=['GET'])
def get_books():
    cur = mysql.connection.cursor()

    # Get all books
    cur.execute("SELECT book_id, title, author, publishing_year FROM books")
    books = cur.fetchall()

    # Get all borrowed books with user info
    cur.execute("""
        SELECT bb.book_id, u.id AS user_id, u.username
        FROM borrowed_books bb
        JOIN users u ON bb.user_id = u.id
    """)
    borrowed_info = cur.fetchall()
    cur.close()

    borrowed_map = {row[0]: {'user_id': row[1], 'username': row[2]} for row in borrowed_info}

    result = []
    for book in books:
        book_data = {
            'book_id': book[0],
            'title': book[1],
            'author': book[2],
            'publishing_year': book[3],
        }
        if book[0] in borrowed_map:
            book_data['borrowed_id'] = borrowed_map[book[0]]['user_id']
            book_data['borrowed_user'] = borrowed_map[book[0]]['username']
        else:
            book_data['borrowed_id'] = None
            book_data['borrowed_user'] = None

        result.append(book_data)

    return jsonify(result), 200


@app.route('/delete_book/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):   
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM books WHERE book_id = %s", (book_id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Book deleted successfully'}), 200

@app.route('/update_book/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    publishing_year = data.get('publishing_year')

    if not title or not author or not publishing_year:
        return jsonify({'error': 'Title, author, and publishing year are required'}), 400
    
    if not request.cookies.get('session_id'):
        return jsonify({'error': 'User not logged in'}), 401

    cur = mysql.connection.cursor()
    # Check if the user is an admin  
    cur.execute("SELECT role FROM users WHERE id = %s", (request.cookies.get('session_id'),))
    user = cur.fetchone()   
    if not user or user[0] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403

    cur.execute(
        "UPDATE books SET title = %s, author = %s, publishing_year = %s WHERE book_id = %s",
        (title, author, publishing_year, book_id)
    )
    
    mysql.connection.commit()
    cur.close()  
    
    return jsonify({'message': 'Book updated successfully'}), 200

@app.route('/borrow_book/<int:book_id>', methods=['POST'])
def borrow_book(book_id):
    session_id = request.cookies.get('session_id')
    if not session_id:
        return jsonify({'error': 'User not logged in'}), 401

    cur = mysql.connection.cursor()
    cur.execute("SELECT id FROM users WHERE id = %s", (session_id,))
    user = cur.fetchone()
    
    if not user:
        cur.close()
        return jsonify({'error': 'User not found'}), 404

    user_id = user[0]

    cur.execute("SELECT * FROM borrowed_books WHERE book_id = %s AND user_id = %s", (book_id, user_id))
    borrow_book = cur.fetchone()

    if borrow_book:
        cur.close()
        return jsonify({'error': 'Book already borrowed by this user'}), 400

    cur.execute("INSERT INTO borrowed_books (book_id, user_id) VALUES (%s, %s)", (book_id, user_id))
    
    mysql.connection.commit()
    cur.close()
    
    return jsonify({'message': 'Book borrowed successfully'}), 201

@app.route('/return_book/<int:book_id>', methods=['POST'])
def return_book(book_id):
    if not request.cookies.get('session_id'):
        return jsonify({'error': 'User not logged in'}), 401

    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT id FROM users WHERE id = %s",
        (request.cookies.get('session_id'),)
    )
    user = cur.fetchone()

    if not user:
        cur.close()
        return jsonify({'error': 'Invalid session'}), 401

    cur.execute(
        "DELETE FROM borrowed_books WHERE book_id = %s AND user_id = %s",
        (book_id, user[0])
    )

    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Book returned successfully'}), 200


@app.route('/borrowed_books', methods=['GET'])
def get_borrowed_books():
    session_id = request.cookies.get('session_id')
    if not session_id:
        return jsonify({'error': 'User not logged in'}), 401

    cur = mysql.connection.cursor()

    # Get user info
    cur.execute("SELECT id, username, role FROM users WHERE id = %s", (session_id,))
    user = cur.fetchone()

    if not user:
        cur.close()
        return jsonify({'error': 'Invalid session'}), 401

    user_id, username, role = user

    if role == 'admin':
        # Admin: get all borrowed books grouped by user
        cur.execute("SELECT id, username FROM users")
        users = cur.fetchall()
        users_dict = {u[0]: u[1] for u in users}

        cur.execute("""
            SELECT bb.book_id, b.title, b.author, bb.user_id
            FROM borrowed_books bb
            JOIN books b ON bb.book_id = b.book_id
        """)
        borrowed_books_data = cur.fetchall()

        borrowed_books = {}
        total_borrowed = 0
        for book_id, title, author, uid in borrowed_books_data:
            total_borrowed += 1
            if uid not in borrowed_books:
                borrowed_books[uid] = []
            borrowed_books[uid].append({
                'book_id': book_id,
                'title': title,
                'author': author
            })

        response = []
        for uid, books in borrowed_books.items():
            response.append({
                'user_id': uid,
                'username': users_dict.get(uid, 'Unknown'),
                'borrowed_books': books
            })

        cur.close()
        return jsonify({
            'total_borrowed_count': total_borrowed,
            'borrowed_by_users': response
        }), 200

    else:
        # Regular user: get only their borrowed books
        cur.execute("""
            SELECT b.book_id, b.title, b.author
            FROM borrowed_books bb
            JOIN books b ON bb.book_id = b.book_id
            WHERE bb.user_id = %s
        """, (user_id,))
        user_books = cur.fetchall()

        borrowed_books = [{
            'book_id': book[0],
            'title': book[1],
            'author': book[2]
        } for book in user_books]

        cur.close()
        return jsonify({
            'user_id': user_id,
            'username': username,
            'borrowed_books': borrowed_books,
            'borrowed_count': len(borrowed_books)
        }), 200

 
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True) 
