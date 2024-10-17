export const getStudentByIdConfig = () => ({
    url: `/student`,
});
export const getModuleByIdConfig = () => ({
    url: `/module_view`,
});

export const getSchoolByIdConfig = () => ({
    url: `/schools`,
});

export const getAllCourseBySchoolIdConfig = (schoolCode) => ({
    url: `/get_course/${schoolCode}`,
});


export const getAllModuleByCourseIdConfig = (courseCode) => ({
    url: `/sms_module/${courseCode}`,
});

export const getAllCountriesByIdConfig = () => ({
    url: `/get_sms_countries`,
});

export const getAllIcaStudentsConfig = () => ({
    url: `/ica_students`,
});


export const icaFilterConfig = () => ({
    url: `/ica_filter`,
});

export const icaStudentDetailsConfig = () => ({
    url: `/ica_student_detail`,
});

export const UploadExcelConfig = () => ({
    url: `/upload_student_excel`,
});

export const studentModuleGroupingConfig = () => ({
    url: `/get_student_modules`,
});

export const getAllStudentsListConfig = () => ({
    url: `/student_name_list`,
});

export const UploadLeaveAttendanceConfig = () => ({
    url: `/upload_leave_attendance`,
});

export const leaveAttendanceTrackingConfig = () => ({
    url: `/get_leave_students`,
});