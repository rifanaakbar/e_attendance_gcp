import { showToastError } from "../../utilities/errortoast";
import { showToastSuccess } from "../../utilities/toast";
import { axios } from "../lib/axios";
import { getAllCountriesByIdConfig, getAllCourseBySchoolIdConfig, getAllIcaStudentsConfig, getAllModuleByCourseIdConfig, getAllStudentsListConfig, getModuleByIdConfig, getSchoolByIdConfig, getStudentByIdConfig, icaFilterConfig, icaStudentDetailsConfig, leaveAttendanceTrackingConfig, studentModuleGroupingConfig, UploadExcelConfig, UploadLeaveAttendanceConfig } from "../lib/requests/student.url";
import { moduleLoading } from "../slices/module.slice";
import { cohortDetailsSlice, countryDetailsSlice, courseDetailsSlice, icaStudentByIdSlice, icaStudentSlice, icaStudentTableListSlice, leaveStudentsListSlice, moduleDetailsSlice, schoolDetailsSlice, studentDataListSlice, studentDetailsSlice, StudentModuleByIdSlice, viewModuleDetailsSlice } from "../slices/student.slice";


export const getStudentByIdAction = (payload, setStudentModalOpen) => {
    return async (dispatch) => {
        dispatch(moduleLoading(true));
        try {
            const { url } = getStudentByIdConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };

            const result = await axios.post(url, payload, { headers });
            const response = result?.data?.students;
            if (result?.status === 200 && response) {
                setStudentModalOpen(true);
                dispatch(studentDetailsSlice(response));
                dispatch(moduleLoading(false));
            }
        } catch (e) {
            dispatch(moduleLoading(false));
            if (e?.response?.status === 404) {
                showToastError("This student doesn't have data.");
            }
        }
    };
};

export const getModuleByIdAction = (payload, setStudentModalOpen) => {
    return async (dispatch) => {
        dispatch(moduleLoading(true));
        try {
            const { url } = getModuleByIdConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };

            const result = await axios.post(url, payload, { headers });
            const response = result?.data;
            if (result?.status === 200 && response) {
                setStudentModalOpen(true);
                dispatch(viewModuleDetailsSlice(response));
                dispatch(moduleLoading(false));
            }
        } catch (e) {
            dispatch(moduleLoading(false));
            if (e?.response?.status === 404) {
                showToastError("This student doesn't have data.");
            }
        }
    };
};

//getALlSchool value
export const getAllSchoolAction = () => {
    return async (dispatch) => {
        try {
            const { url } = getSchoolByIdConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.get(url, { headers });
            const response = result?.data?.schools
            if (result?.status === 200 && response) {
                dispatch(schoolDetailsSlice(response))
            }
        } catch (e) {
            showToastError("An error occurred");
        }
    };
};

//getAllCourse value
export const getAllCourseBySchoolIdAction = (schoolCode) => {
    return async (dispatch) => {
        try {
            const { url } = getAllCourseBySchoolIdConfig(schoolCode);
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.get(url, { headers });
            const response = result?.data?.courses
            if (result?.status === 200 && response) {
                dispatch(courseDetailsSlice(response))
            }
        } catch (e) {
            showToastError("An error occurred");
        }
    };
};

//getAllModule value
export const getAllModuleByCourseIdAction = (courseCode) => {
    return async (dispatch) => {
        try {
            const { url } = getAllModuleByCourseIdConfig(courseCode);
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.get(url, { headers });
            const response = result?.data
            if (result?.status === 200 && response) {
                const { cohort_result, module_result } = response;

                // Dispatch the cohort and module data separately
                if (cohort_result) {
                    dispatch(cohortDetailsSlice(cohort_result));
                }

                if (module_result) {
                    dispatch(moduleDetailsSlice(module_result));
                }
            }
        } catch (e) {
            showToastError("An error occurred");
        }
    };
};

// getAllCountry
export const getAllCountriesAction = () => {
    return async (dispatch) => {
        try {
            const { url } = getAllCountriesByIdConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.get(url, { headers });
            const response = result?.data
            if (result?.status === 200 && response) {
                dispatch(countryDetailsSlice(response))
            }

        } catch (e) {
            showToastError("An error occurred");
        }
    };
};

export const getAllIcaStudentsList = (schoolCode, courseCode) => {
    return async (dispatch) => {
        try {
            const { url } = getAllIcaStudentsConfig()
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const payload = {
                school_code: schoolCode,
                course_code: courseCode
            }
            const result = await axios.post(url, payload, { headers })
            const response = result?.data
            if (result.status === 200 && response) {
                dispatch(icaStudentSlice(response))
            }
        } catch (e) {

        }
    }
}

export const getFilterICAReportAction = (payload) => {
    return async (dispatch) => {
        dispatch(moduleLoading(true));
        try {
            const { url } = icaFilterConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.post(url, payload, { headers });
            const response = result?.data?.course_details
            if (result?.status === 200 && response) {
                dispatch(icaStudentTableListSlice(response));
                dispatch(moduleLoading(false));
            }
        } catch (e) {
            dispatch(moduleLoading(false));
            showToastError("An error occurred");
        }
    };
}

export const getICAStudentDetailsbyID = (payload, setStudentModalOpen) => {
    return async (dispatch) => {
        dispatch(moduleLoading(true))
        try {
            const { url } = icaStudentDetailsConfig()
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.post(url, payload, { headers })
            const response = result?.data
            if (result.status === 200 && response) {
                dispatch(moduleLoading(false))
                setStudentModalOpen(true)
                dispatch(icaStudentByIdSlice(response))
            }
        } catch (e) {
            dispatch(moduleLoading(false))
        }
    }
}

export const uploadExcelAction = (payload) => {
    return async (dispatch) => {
        try {
            const { url } = UploadExcelConfig();
            const headers = {
                Accept: "application/json",
            };

            const result = await axios.post(url, payload, { headers });
            if (result?.status === 200) {
                showToastSuccess("Excel uploaded successfully")
            }
        } catch (e) {
            if (e?.response?.status === 404) {
                showToastError("Please provide the right template");
            } else {
                showToastError("Upload failed. Please try again.");
            }
        }
    };
};

export const getStudentModuleGroupingAction = (payload, setStudentModuleGroupModalVisible) => {
    return async (dispatch) => {
        dispatch(moduleLoading(true));
        try {
            const { url } = studentModuleGroupingConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.post(url, payload, { headers });
            const response = result?.data?.student_module
            if (result?.status === 200 && response) {
                setStudentModuleGroupModalVisible(true);
                dispatch(StudentModuleByIdSlice(response));
                dispatch(moduleLoading(false));
            }
        } catch (e) {
            dispatch(moduleLoading(false));
            if (e?.response?.status === 404) {
                showToastError("This student doesn't have data.");
            }
        }
    };
};

export const getICAStudentModuleGroupingAction = (payload, getICAStudentModuleGroupingAction) => {
    return async (dispatch) => {
        dispatch(moduleLoading(true));
        try {
            const { url } = studentModuleGroupingConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.post(url, payload, { headers });
            const response = result?.data?.student_module
            if (result?.status === 200 && response) {
                getICAStudentModuleGroupingAction(true);
                dispatch(StudentModuleByIdSlice(response));
                dispatch(moduleLoading(false));
            }
        } catch (e) {
            dispatch(moduleLoading(false));
            if (e?.response?.status === 404) {
                showToastError("This student doesn't have data.");
            }
        }
    };
};

export const getAllStudentNameListAction = (payload) => {
    return async (dispatch) => {
        try {
            const { url } = getAllStudentsListConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.post(url, payload, { headers })
            const response = result?.data?.students
            if (result?.status === 200 && response) {
                dispatch(studentDataListSlice(response))
            }
        } catch (e) {
            dispatch(moduleLoading(false));
        }
    }
}

export const uploadLeaveAttendanceAction = (payload, setUploadModalOpen) => {
    return async (dispatch) => {
        try {
            const { url } = UploadLeaveAttendanceConfig();
            const headers = {
                Accept: "application/json",
            };

            const result = await axios.post(url, payload, { headers });
            if (result?.status === 200) {
                setUploadModalOpen(false)
                showToastSuccess("Excel uploaded successfully")
            }
        } catch (e) {
            if (e?.response?.status === 404) {
                showToastError("Please provide the right template");
            } else {
                showToastError("Upload failed. Please try again.");
            }
        }
    };
};

export const leaveDetailsListActions = (payload, signal) => {
    return async (dispatch) => {
        dispatch(moduleLoading(true))
        try {
            const { url } = leaveAttendanceTrackingConfig()
            const headers = {
                Accept: "application/json",
            };

            const result = await axios.post(url, payload, { headers, signal });
            const response = result?.data?.students
            if (result?.status === 200 && response) {
                dispatch(moduleLoading(false))
                dispatch(leaveStudentsListSlice(response))
            }
        } catch (e) {
            dispatch(moduleLoading(false))
        }
    }
}



