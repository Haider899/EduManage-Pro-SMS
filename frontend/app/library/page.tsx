'use client';

import { motion } from 'framer-motion';
import { FiBook, FiSearch, FiDownload, FiUser } from 'react-icons/fi';

const LibraryPage = () => {
  const books = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      category: 'Classic',
      available: 5,
      total: 8,
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0061120084',
      category: 'Classic',
      available: 3,
      total: 6,
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      category: 'Dystopian',
      available: 2,
      total: 5,
    },
  ];

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Library Management</h1>
          <p className="text-slate-400">Browse and manage library books</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-3 glass-effect rounded-lg border border-slate-700">
        <FiSearch size={20} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search books by title or author..."
          className="bg-transparent outline-none w-full"
        />
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Books', value: '1,245', icon: FiBook },
          { label: 'Issued Books', value: '356', icon: FiDownload },
          { label: 'Students', value: '1,234', icon: FiUser },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-effect rounded-xl p-6 border border-slate-700 card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                <h3 className="text-3xl font-bold gradient-text">{stat.value}</h3>
              </div>
              <stat.icon size={28} className="text-purple-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Books List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-xl overflow-hidden border border-slate-700"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/30">
              <th className="px-6 py-4 text-left font-semibold">Title</th>
              <th className="px-6 py-4 text-left font-semibold">Author</th>
              <th className="px-6 py-4 text-left font-semibold">Category</th>
              <th className="px-6 py-4 text-left font-semibold">Available</th>
              <th className="px-6 py-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, idx) => (
              <motion.tr
                key={book.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="border-b border-slate-700 hover:bg-slate-800/20 transition"
              >
                <td className="px-6 py-4 font-medium">{book.title}</td>
                <td className="px-6 py-4 text-slate-300">{book.author}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={book.available > 0 ? 'text-green-400' : 'text-red-400'}>
                    {book.available} / {book.total}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    disabled={book.available === 0}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Issue
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default LibraryPage;
