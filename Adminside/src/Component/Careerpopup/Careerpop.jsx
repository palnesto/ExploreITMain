import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import PropTypes from 'prop-types';
const Careerpop = ({ onClose, onSubmit, initialData, onDelete }) => {
    const [career, setCareer] = useState(initialData?.CareerName || '');
    const [careerDescription, setCareerDescription] = useState(initialData?.CareerDesc || '');
    const maxDescriptionLength = 300;

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { CareerName: career, CareerDesc: careerDescription, Active: initialData?.Active || false };
        onSubmit(data);
    };

    const handleDelete = () => {
        onDelete(initialData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[36rem] h-auto">
                <div className='flex flex-row items-center justify-between'>
                    <h1 className="mb-6 text-xl font-bold text-start">{initialData ? 'Edit Career' : 'New Career'}</h1>

                    <RxCross2 className='cursor-pointer' size={24} onClick={onClose} />
                </div>

                <div className='bg-[#F5F5F5] p-6 rounded-lg mb-6'>
                    <h1 className="mb-2 text-lg font-medium whitespace-normal text-start text-ellipsis">Career Name</h1>
                    <input
                        className="w-[16rem] h-10 px-4 mb-4 border border-[#E1E1E1] rounded"
                        type="text"
                        value={career}
                        onChange={(e) => setCareer(e.target.value)}
                        placeholder="Add Name"
                    />
                    <div className='flex flex-row items-center justify-between mb-2'>
                        <h1 className="text-lg font-medium whitespace-normal text-start text-ellipsis">Add Description</h1>
                        <div className="text-sm text-gray-400">
                            {`${maxDescriptionLength - careerDescription.length}/${maxDescriptionLength} remaining`}
                        </div>
                    </div>
                    <textarea
                        className="w-full h-32 px-4 py-2 mb-4 border border-[#E1E1E1] rounded"
                        value={careerDescription}
                        onChange={(e) => setCareerDescription(e.target.value)}
                        maxLength={maxDescriptionLength}
                        placeholder="Type something longer here....."
                    ></textarea>
                </div>
                <div className="flex justify-center space-x-8">
                    <button
                        className="px-6 py-2 font-medium text-black border-2 border-gray-300 rounded-md"
                        onClick={initialData ? handleDelete : onClose}
                    >
                        {initialData ? 'Delete' : 'Cancel'}
                    </button>
                    <button
                        className="px-6 py-2 font-medium text-white bg-black rounded-md"
                        onClick={handleSubmit}
                    >
                        {initialData ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};
Careerpop.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        CareerName: PropTypes.string,
        CareerDesc: PropTypes.string,
        Active: PropTypes.bool,
    }),
    onDelete: PropTypes.func.isRequired,
};
export default Careerpop;
