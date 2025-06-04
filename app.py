from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
app = Flask(__name__)

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
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    cur.close()

    user_list = []
    for user in users:
        user_list.append({
            'id': user[0],
            'username': user[1],
            'role': user[3]
        })

    return jsonify(user_list), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5000, debug=True)