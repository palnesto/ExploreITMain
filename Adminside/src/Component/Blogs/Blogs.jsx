import { useEffect, useState } from 'react';
import Blogpopup from '../BlogPopup/Blogpopup';
import { BiSolidEditAlt, BiShow, BiHide } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Blogs = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/v1/getBlog`);
                if (response.data && response.data.status) {
                    setBlogs(response.data.data);
                } else {
                    console.error("API response does not contain expected data");
                }
            } catch (error) {
                console.log("Error fetching blogs: ", error);
            }
        };
        fetchBlogs();
    }, []);

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setEditingIndex(null);
    };

    const handlePopupToggle = (index = null) => {
        setIsPopupOpen(true);
        setEditingIndex(index);
    };

    const handleFormSubmit = async (data) => {
        try {
            let response;
            if (editingIndex !== null) {
                response = await axios.put(`${API_BASE_URL}/v1/updateBlog/${blogs[editingIndex].id}`, data);
            } else {
                response = await axios.post(`${API_BASE_URL}/v1/Blog`, data);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(editingIndex !== null ? 'Blog updated successfully' : 'Blog added successfully');
                setBlogs(editingIndex !== null ? blogs.map((blog, index) => index === editingIndex ? response.data.data : blog) : [response.data.data, ...blogs]);
                handleClosePopup();
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while submitting the form");
        }
    };

    const handleDelete = async (blogToDelete) => {
        try {
            await axios.delete(`${API_BASE_URL}/v1/deletBlogbyId/${blogToDelete.id}`);
            setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id));
            handleClosePopup();
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("An error occurred while deleting the blog");
        }
    };

    const togglePublished = async (index) => {
        try {
            const updatedBlog = { ...blogs[index], Active: !blogs[index].Active };
            const response = await axios.put(`${API_BASE_URL}/v1/updateBlog/${blogs[index].id}`, updatedBlog);
            setBlogs(blogs.map((blog, idx) => idx === index ? response.data.data : blog));
        } catch (error) {
            console.error("Error toggling published state:", error);
            toast.error("An error occurred while toggling the published state");
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.BlogName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="top-0 left-0 right-0 z-50 bg-white ml-[12.5rem] pt-2">
                <div className="flex items-center justify-between h-16 px-10">
                    <h1 className="text-2xl font-bold text-gray-800">Blogs</h1>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search for something"
                            className="px-4 py-2 text-sm bg-gray-100 rounded-full focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <CiSearch className="absolute text-xl text-gray-600 right-3" />
                    </div>
                </div>
            </div>
            <div className="bg-[#F1F1F1] py-10 mt-8">
                <div className="flex justify-start ml-[16rem] mb-6">
                    <button
                        className="px-4 py-3 font-medium text-black bg-white shadow-md rounded-xl"
                        onClick={() => handlePopupToggle()}
                    >
                        + Add New Blog
                    </button>
                </div>
                {isPopupOpen && (
                    <Blogpopup
                        onClose={handleClosePopup}
                        onSubmit={handleFormSubmit}
                        initialData={editingIndex !== null ? blogs[editingIndex] : null}
                        onDelete={handleDelete}
                    />
                )}
                <div className='2xl:w-4/5 3xl:w-4/5 lg:w-[46rem] xl:w-3/4 p-6 bg-white rounded-lg shadow-lg ml-[16rem]'>
                    <div className="grid grid-cols-1 gap-2 px-2 pt-[2rem] pb-[10rem] rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5">
                        {filteredBlogs.map((blog, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center w-[12rem] transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg relative overflow-hidden"
                                onClick={() => handlePopupToggle(index)}
                            >
                                <div className='absolute z-10 flex flex-row items-center top-2 left-2'>
                                    <div
                                        className={`w-2 h-2 rounded-full ${blog.Active ? 'bg-green-500' : 'bg-gray-400'}`}
                                    ></div>
                                </div>
                                <div className="relative w-full h-20 mb-4 bg-gray-100">
                                    {blog.photo1 && (
                                        <img
                                            src={blog.photo1}
                                            alt="Blog"
                                            className="object-cover w-full h-full"
                                            style={{ filter: 'brightness(0.7)' }}
                                        />
                                    )}
                                </div>
                                <span className="text-lg font-semibold whitespace-normal text-ellipsis">{blog.BlogName}</span>
                                <div className="flex items-center mt-2 mb-4 space-x-2">
                                    <button onClick={(e) => { e.stopPropagation(); togglePublished(index); }}>
                                        {blog.Active ? <BiShow className="p-1 text-gray-600 border border-gray-300 rounded-md" size={24} /> : <BiHide className="p-1 text-gray-400 border border-gray-300 rounded-md" size={24} />}
                                    </button>
                                    <BiSolidEditAlt className="p-1 border border-gray-300 rounded-md cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePopupToggle(index); }} size={24} />
                                    {/* <BiTrash className="p-1 border border-gray-300 rounded-md cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(blog); }} size={24} /> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blogs;
