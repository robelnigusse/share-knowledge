import React from 'react'

const Upload = () => {
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
  <h2 className="text-xl font-semibold mb-4">Upload Book</h2>

  <input
    type="file"
    className="w-full border rounded-lg p-2 mb-4"
  />

  <select className="w-full border rounded-lg p-2 mb-4">
    <option selected={true}>General</option>
    <option>Programming</option>
    <option>Science</option>
  </select>

  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
    Upload
  </button>
</div>
  )
}

export default Upload