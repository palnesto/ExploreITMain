import { useEffect, useState } from 'react';
import Careerpop from '../Careerpopup/Careerpop'; // Ensure the correct path to Careerpop component
import { BiSolidEditAlt, BiShow, BiHide } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useLoginStore from '../../store/useLoginStore';
const Careers = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [careers, setCareers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/v1/getCareer`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && response.data.status) {
                    setCareers(response.data.data);
                } else {
                    console.error("API response does not contain expected data");
                }
            } catch (error) {
                console.log("Error fetching careers: ", error);
            }
        };
        fetchCareers();
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
                response = await axios.put(`${API_BASE_URL}/v1/updateCareer/${careers[editingIndex].id}`, data);
            } else {
                response = await axios.post(`${API_BASE_URL}/v1/Career`, data);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(editingIndex !== null ? 'Career updated successfully' : 'Career added successfully');
                setCareers(editingIndex !== null ? careers.map((career, index) => index === editingIndex ? response.data.data : career) : [response.data.data, ...careers]);
                handleClosePopup();
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while submitting the form");
        }
    };

    const handleDelete = async (careerToDelete) => {
        try {
            await axios.delete(`${API_BASE_URL}/v1/deletCareerbyId/${careerToDelete.id}`);
            setCareers(careers.filter(career => career.id !== careerToDelete.id));
            handleClosePopup();
            toast.success("career deleted successfully");

        } catch (error) {
            console.error("Error deleting career:", error);
            toast.error("An error occurred while deleting the career");
        }
    };

    const togglePublished = async (e, index) => {
        e.stopPropagation();
        try {
            const updatedCareer = { ...careers[index], Active: !careers[index].Active };
            const response = await axios.put(`${API_BASE_URL}/v1/updateCareer/${careers[index].id}`, updatedCareer);
            setCareers(careers.map((career, idx) => idx === index ? response.data.data : career));
        } catch (error) {
            console.error("Error toggling published state:", error);
            toast.error("An error occurred while toggling the published state");
        }
    };

    const filteredCareers = careers.filter(career =>
        career.CareerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="top-0 left-0 right-0 z-50 bg-white ml-[12.5rem] pt-2">
                <div className="flex items-center justify-between h-16 px-10">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Careers
                    </h1>
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
                        + Add New Career
                    </button>
                </div>

                {isPopupOpen && (
                    <Careerpop
                        onClose={handleClosePopup}
                        onSubmit={handleFormSubmit}
                        initialData={editingIndex !== null ? careers[editingIndex] : null}
                        onDelete={handleDelete}
                    />
                )}
                <div className='2xl:w-4/5 3xl:w-4/5 lg:w-[46rem] xl:w-3/4 p-6 bg-white rounded-lg shadow-lg ml-[16rem]'>
                    <div className="grid grid-cols-1 2xl:gap-4 3xl:gap-4 xl:gap-4 lg:gap-4 px-2 pt-[2rem] pb-[10rem] rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-7">
                        {filteredCareers.map((career, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center p-4 w-[12rem] transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg relative"
                                onClick={() => handlePopupToggle(index)}
                            >
                                <div className='absolute flex flex-row items-center top-2 left-2'>
                                    <div
                                        className={`w-2 h-2 rounded-full ${career.Active ? 'bg-green-500' : 'bg-gray-400'}`}
                                    ></div>
                                </div>
                                <span className="text-lg font-semibold whitespace-normal text-ellipsis">{career.CareerName}</span>
                                <div className="flex items-center mt-4 space-x-2">
                                    <button onClick={(e) => { e.stopPropagation(); togglePublished(e, index); }}>
                                        {career.Active ? <BiShow className="p-1 text-gray-600 border border-gray-300 rounded-md" size={24} /> : <BiHide className="p-1 text-gray-400 border border-gray-300 rounded-md" size={24} />}
                                    </button>
                                    <BiSolidEditAlt className="p-1 border border-gray-300 rounded-md cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePopupToggle(index); }} size={24} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Careers;
