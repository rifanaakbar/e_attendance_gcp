import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { AutoComplete, Modal, Pagination, Select, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "../../baseComponents/Table";
import { SearchIcon } from "../../../icons/SearchIcon";
import "./remark_attendance.scss";
import { getAllStudentNameListAction, leaveDetailsListActions } from "../../../store/actions/student.action";
import { PDFdownloadIcon, XLSDownloadIcon } from "../../../icons";
import { studentDataListSlice } from "../../../store/slices/student.slice";
import dayjs from "dayjs";
import LeaveUploadModule from "./LeaveUploadModule";

const LeaveAttendanceModule = () => {
  const [tableData, setTableData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [tableLoader, setTableLoader] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentActive, setStudentActive] = useState(null);

  const [tooltipMessage, setTooltipMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const dispatch = useDispatch();

  const { moduleLoader, } = useSelector((state) => state?.moduleState);

  const { studentDataList, leaveStudentsList } = useSelector((state) => state?.studentState);

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;

  const years = [];
  for (let i = currentYear; i >= 2016; i--) {
    years.push({ value: i, label: i.toString() });
  }

  const allMonths = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthOptions, setMonthOptions] = useState(allMonths);
  const [isYearSelected, setYearSelected] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);


  useEffect(() => {
    if (selectedYear === currentYear) {
      setMonthOptions(allMonths.filter((month) => month.value <= currentMonth));
    } else {
      setMonthOptions(allMonths);
    }
  }, [selectedYear, currentYear, currentMonth]);

  const hasActiveFilters = () => {
    return (
      selectedStudent
    );
  };


  useEffect(() => {
    if (leaveStudentsList && Array.isArray(leaveStudentsList)) {
      const formattedData = leaveStudentsList.map((item, index) => ({
        key: index,
        student_id: item.student_id || "N/A",
        student_name: item.student_name || "N/A",
        leave_date: item.leave_date || "N/A",
        leave_reason: item.leave_reason || "N/A",
        leave_status: item.leave_status || "N/A",
        leave_date: item.leave_date
          ? moment.utc(item.leave_date).format('YYYY-MM-DD HH:mm:ss')
          : "N/A",
        email: item.student_email || "N/A"
      }));

      setTableData(formattedData);
    } else {
      setTableData([]);
    }
  }, [leaveStudentsList]);


  const ActiveFilterSearch = () => {
    if (!selectedStudent) {
      return "Please apply a filter to search.";
    }
    return "";
  };


  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = tableData ? tableData.slice(startIndex, endIndex) : [];

  const abortControllerRef = useRef(new AbortController());
  // Method for Abort API 

  const handleSearch = () => {
    const errorMessage = ActiveFilterSearch();

    if (errorMessage) {
      setTooltipMessage(errorMessage);
      setShowTooltip(true);
      return;
    }

    setShowTooltip(false);
    const payload = {
      student_name: selectedStudent || "",
      year: selectedYear,
      month: selectedMonth
    };

    setCurrentPage(1);
    setIsFiltered(true);
    abortControllerRef.current = new AbortController();
    dispatch(leaveDetailsListActions(payload, abortControllerRef.current.signal));
  };

  // Abort the API call when navigating to another page before the response arrives.
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset state function
  const resetState = () => {
    setStudentActive(null);
    setIsFiltered(false);
    setSelectedStudent(null);
    setCurrentPage(1);
    setTableData([]);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  // Reset state when the component mounts
  useEffect(() => {
    resetState();
  }, []);

  const handleClear = () => {
    resetState();
  };

  useEffect(() => {
    setTableLoader(moduleLoader);
  }, [moduleLoader]);

  const columns = [
    {
      title: <span className="font-[700]">Student ID</span>,
      dataIndex: "student_id",
      key: "student_id",
      width: 400,
    },
    {
      title: <span className="font-[700]">Student name</span>,
      dataIndex: "student_name",
      key: "student_name",
      width: 400,
    },
    {
      title: <span className="font-[700]">Email</span>,
      dataIndex: "email",
      key: "email",
      width: 400,
      render: (text) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
          {text}
        </div>
      ),
    },
    {
      title: <span className="font-[700]">Attendance Status</span>,
      dataIndex: "leave_status",
      key: "leave_status",
      width: 400,
    },
    {
      title: <span className="font-[700]">Leave date</span>,
      dataIndex: "leave_date",
      key: "leave_date",
      width: 400,
    },
    {
      title: <span className="font-[700]">Reason</span>,
      dataIndex: "leave_reason",
      key: "leave_reason",
      width: 400,
    },
  ];

  const student_payload = {
    school_code: "",
    module_code: "",
    course_cohort_name: ""
  }
  useEffect(() => {

    dispatch(getAllStudentNameListAction(student_payload))
  }, [dispatch])

  return (
    <div>
      <div className="text-center text-3xl font-bold">
        Leave Attendance Report
      </div>
      {/* <div className="flex gap-4 justify-end">
        {currentData.length > 0 && !tableLoader ? (
          <button className="btn-download flex items-center shadow-md space-x-2">
            <PDFdownloadIcon className="" />
            <span className="text-white text-xs">PDF</span>
          </button>
        ) : (
          ""
        )}
        {currentData.length > 0 && !tableLoader ? (
          <div className="">
            <button className="xls-download flex items-center shadow-md space-x-2">
              <XLSDownloadIcon className="" />
              <span className="text-white text-xs">XLS</span>
            </button>
          </div>
        ) : ""}
      </div> */}

      <div className="flex justify-between my-4">
        <div className="border-2 border-slate-300 p-3 w-10/12 grid grid-cols-4 gap-4 rounded-lg ">

          <div className="ant-dropdown bg-white shadow-md rounded-xl flex items-center w-full">
            <AutoComplete
              style={{ placeholder: { fontFamily: "", color: "black" } }}
              variant={false}
              className="custom-placeholder border-none font-sans h-10 flex items-center focus:outline-none w-full font-medium"
              optionFilterProp="label"
              options={studentOptions}
              onSelect={(value, option) => {
                setSelectedStudent(value);
                setStudentActive(value);
              }}
              onSearch={(value) => {
                setStudentActive(value);

                if (value) {
                  const dataList = studentDataList ? studentDataList : leaveStudentsList;
                  const filteredOptions = dataList.filter((student) => {
                    return (
                      (student.student_name &&
                        student.student_name.toLowerCase().includes(value.toLowerCase())) ||
                      (student.student_id &&
                        student.student_id.toLowerCase().includes(value.toLowerCase())) ||
                      (student.student_email &&
                        student.student_email.toLowerCase().includes(value.toLowerCase())) ||
                      (student.enrollment_id &&
                        student.enrollment_id.toLowerCase().includes(value.toLowerCase()))
                    );
                  }).map((student, index) => ({
                    value: student.student_name,
                    label: `${student.student_name} (${student.student_id})`,
                    key: `${index}_${student.student_id}`,
                  }));

                  if (filteredOptions.length === 0) {
                    setStudentOptions([
                      {
                        value: 'no_data',
                        label: 'No data',
                        disabled: true,
                      },
                    ]);
                  } else {
                    setStudentOptions(filteredOptions);
                  }
                } else {
                  setStudentOptions([]);
                  setSelectedStudent(null);
                }
              }}
              placeholder="Search by Name, Email & ID"
              suffixIcon={
                studentActive && !moduleLoader ? (
                  <CloseOutlined
                    onClick={() => {
                      setStudentActive(null);
                      setSelectedStudent(null);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                    className="hover:text-gray-700 transition-colors duration-200"
                  />
                ) : (
                  <SearchIcon />
                )
              }
              value={studentActive || undefined}
            />
          </div>

          <div className="ant-dropdown bg-white shadow-md rounded-xl flex items-center w-full">
            <Select
              variant={false}
              className="custom-placeholder border-none font-sans h-10 flex items-center focus:outline-none w-full font-medium"
              optionFilterProp="label"
              placeholder="Select year"
              showSearch
              options={years}
              disabled={moduleLoader || !selectedStudent}
              value={selectedYear}
              onChange={(value, option) => {
                setSelectedYear(value);
                setYearSelected(true);
                setSelectedMonth(null);
              }}
            ></Select>
          </div>

          <div className="ant-dropdown bg-white shadow-md rounded-xl flex items-center w-full">
            <Select
              variant={false}
              className="custom-placeholder border-none font-sans h-10 flex items-center focus:outline-none w-full font-medium"
              optionFilterProp="label"
              placeholder="Select month"
              showSearch
              disabled={moduleLoader || !isYearSelected}
              options={monthOptions}
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
            ></Select>
          </div>
          {
            !tableLoader && (
              <div
                className="cursor-pointer font-medium text-white bg-rose-800 w-fit text-sm px-3 flex items-center rounded-lg
          hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-opacity-50"
                onClick={() => { setUploadModalOpen(true) }}
              >
                Upload leave attendance
              </div>
            )
          }
        </div>

        <div className="flex justify-center items-center">
          {hasActiveFilters() && !tableLoader && (
            <button
              type="button"
              onClick={handleClear}
              className="font-medium text-rose-800"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex justify-center items-center">
          <div>
            <Tooltip
              title={tooltipMessage}
              open={showTooltip}
              placement="topLeft"
              onOpenChange={(visible) => setShowTooltip(visible)}
              trigger="click"
            >
              <button
                className="bg-rose-800 text-white font-medium tracking-wider py-2 px-10 rounded-lg shadow-md hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-opacity-50"
                onClick={handleSearch}
                disabled={moduleLoader}
              >
                Search
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="mt-5 ant-table  rounded-xl shadow-xl">
        {tableData ? (
          <Table
            data={currentData}
            columns={columns}
            loading={tableLoader}
            isFiltered={isFiltered}
          />
        ) : (
          <div></div>
        )}
      </div>
      <div className=" font-sans flex justify-end mt-5 ">
        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={tableData.length}
            onChange={handlePageChange}
            hideOnSinglePage={true}
            showSizeChanger={false}
            className="table-pagination custom-pagination-font"
          />
        </div>
      </div>

      <Modal
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        footer={null}
        centered={true}
        maskClosable={false}
      >
        <LeaveUploadModule setUploadModalOpen={setUploadModalOpen} />
      </Modal>
    </div>

  );
};

export default LeaveAttendanceModule;
