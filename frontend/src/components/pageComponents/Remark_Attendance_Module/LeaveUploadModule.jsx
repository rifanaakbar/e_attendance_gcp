import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadExcelAction, uploadLeaveAttendanceAction } from "../../../store/actions/student.action";


const LeaveUploadModule = ({
    setUploadModalOpen
}) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    // const MAX_FILE_SIZE = 2 * 1024 * 1024; 

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }
        // if (file.size > MAX_FILE_SIZE) {
        //   alert("File size exceeds 2 MB. Please select a smaller file.");
        //   return;
        // }
        if (loading) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        try {
            await dispatch(uploadLeaveAttendanceAction(formData, setUploadModalOpen));
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans flex flex-col justify-center items-center p-2">
            <div className="text-2xl font-semibold mb-4">Leave Attendance Upload</div>

            <div className="bg-white justify-center shadow-2xl rounded-xl p-8 w-full max-w-lg">
                <h4 className="text-xl font-medium mb-8">
                    Upload the excel
                </h4>
                <div className="mb-6">
                    <input
                        type="file"
                        id="file"
                        ref={fileInputRef}
                        className="w-full text-gray-600 py-2 px-4 border border-gray-300 rounded-md"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex justify-between mb-6">
                    <button
                        className={`bg-rose-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-rose-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>

                <p className="text-red-600 text-sm text-center">
                    <strong style={{ color: 'black' }}>Note:</strong> Please ensure that the file name has not been used previously.
                </p>
            </div>
        </div>
    );
};

export default LeaveUploadModule;
