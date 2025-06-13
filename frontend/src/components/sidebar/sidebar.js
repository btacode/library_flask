import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside style={{ width: '200px', backgroundColor: '#eee', padding: '1rem' }}>
    <nav>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/Users">Users</Link></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
