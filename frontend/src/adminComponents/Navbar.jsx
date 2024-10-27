// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-slate-900 p-4 border-b-black">
            <div className="container mx-auto flex justify-center items-center">
                <h1 className="text-white text-lg font-semibold">Drug-Trafficking Tracker</h1>
            </div>
        </nav>
    );
};

export default Navbar;
