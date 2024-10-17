import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allCourses: {},
    getallModules: {},
    getallCourseModules: {},
    AllModuleAttendance: [],
    AllStudentAttendance: [],
    getallCohort: {},
    moduleLoader: false,
};

const courseSlice = createSlice({
    name: 'courseSlice',
    initialState,
    reducers: {
        courseDataSlice: (state, { payload }) => {
            state.allCourses = payload;
        },
        moduleDataSlice: (state, { payload }) => {
            state.getallModules = payload;
        },
        courseModuleDataSlice: (state, { payload }) => {
            state.getallCourseModules = payload;
        },
        cohortDataSlice: (state, { payload }) => {
            state.getallCohort = payload;
        },
        getAllModuleAttendanceSlice: (state, { payload }) => {
            state.AllModuleAttendance = payload;
        },
        getAllStudentAttendanceSlice: (state, { payload }) => {
            state.AllStudentAttendance = payload;
        },
        moduleLoading: (state, { payload }) => {
            state.moduleLoader = payload;
        },
    },
});

const { actions, reducer } = courseSlice;

export const {
    courseDataSlice,
    moduleDataSlice,
    courseModuleDataSlice,
    cohortDataSlice,
    getAllModuleAttendanceSlice,
    getAllStudentAttendanceSlice,
    moduleLoading,
    studentDataSlice
} = actions;

export default reducer;
