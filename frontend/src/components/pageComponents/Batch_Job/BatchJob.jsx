import React, { useState, useEffect } from "react";
import { Table } from "../../baseComponents/Table";
import { Button, Pagination, Select } from "antd";
import { ActionMenuIcon } from "../../../icons";
import BatchJobDetails from "./BatchJobDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllBatchJob } from "../../../store/actions/batchjob.action";
import { showToastError } from "../../../utilities/errortoast";

const BatchJob = () => {
  const [tableData, setTableData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [tableLoader, setTableLoader] = useState(false);
  const [batchJobOptions, setBatchJobOptions] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [findFilter, setFindFilter] = useState('filter');

  const pageSize = 5;

  const dispatch = useDispatch();
  const { moduleLoader } = useSelector((state) => state?.moduleState);
  const { allBatchData, allBatchOptions } = useSelector((state) => state?.batchState);


  useEffect(() => {
    if (allBatchData && Array.isArray(allBatchData)) {
      const formattedData = allBatchData.map((item, index) => ({
        key: index,
        batchJobName: item.batchjob_name || "N/A",
        batchJobStartTime: item.batchjob_date || "N/A",
        batchJobStatus: item.batch_job_status || "N/A",
        batchJobId: item.batchjob_id,
      }));
      setTableData(formattedData)
    } else {
      setTableData([]);
    }
  }, [allBatchData]);

  useEffect(() => {
    if (allBatchOptions && Array.isArray(allBatchOptions)) {
      const options = allBatchOptions.map((job) => ({
        value: job.batchjob_id,
        label: job.batchjob_name,
      }));
      setBatchJobOptions(options);
    }
  }, [allBatchOptions]);


  // Handle batch job selection
  const handleBatchChange = (value) => {
    setFindFilter("")
    setSelectedBatchId(value);
  };

  const handleDetailsClick = async (record) => {
    const payload = { batchjob_id: record.batchJobId };

    try {
      const response = await dispatch(getAllBatchJob(payload, 'specificFilter'));
      if (response) {
        showModal(record);
      }
    } catch (error) {
      showToastError("An error occurred");
    }
  };
  const initial_payload = {
    batchjob_id: selectedBatchId
  }

  useEffect(() => {
    dispatch(getAllBatchJob(initial_payload, findFilter));
  }, [dispatch]);

  useEffect(() => {
    setTableLoader(moduleLoader);
  }, [moduleLoader]);

  const hasActiveFilters = () => {
    return selectedBatchId;
  };

  const showModal = (record) => {
    setSelectedStudentData(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = () => {
    const payload = {
      batchjob_id: selectedBatchId
    }
    dispatch(getAllBatchJob(payload, findFilter));
    setIsFiltered(true);
  }



  const handleClear = () => {
    setSelectedBatchId(null);
    setSelectedStudentData(null);
    setTableData([]);
    setIsFiltered(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = tableData ? tableData.slice(startIndex, endIndex) : [];

  const columns = [
    {
      title: <span className="font-[700]">Batch name</span>,
      dataIndex: "batchJobName",
      key: "batchJobName",
      width: 500,
    },
    {
      title: <span className="font-[700]">Start date</span>,
      dataIndex: "batchJobStartTime",
      key: "batchJobStartTime",
      render: (date) => new Date(date).toLocaleDateString(),
      width: 500,
    },
    {
      title: <span className="font-[700]">Status</span>,
      dataIndex: "batchJobStatus",
      key: "batchJobStatus",
      width: 500,
    },
    {
      title: <span className="font-[700]">Details</span>,
      key: "details",
      render: (text, record) => (
        <Button
          icon={<ActionMenuIcon />}
          onClick={() => handleDetailsClick(record)}
          type="link"
        />
      ),
      width: 400,
    },
  ];



  return (
    <div>
      <div className="text-center text-3xl font-bold">Batch Job</div>
      <div className="flex justify-between my-4">
        <div className="border-2 border-slate-300 p-3 w-3/12 rounded-lg">
          <div className="ant-dropdown bg-white shadow-md rounded-xl flex items-center w-full">
            <Select
              variant={false}
              className="custom-placeholder border-none font-sans h-10 flex items-center focus:outline-none w-full font-medium"
              optionFilterProp="label"
              placeholder="Select batch job"
              value={selectedBatchId}
              showSearch
              onChange={handleBatchChange}
              options={batchJobOptions}
            >

            </Select>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="mr-10">
            {hasActiveFilters() && (
              <button
                type="button"
                onClick={handleClear}
                className="font-medium text-rose-800"
              >
                Clear
              </button>
            )}
          </div>
          <div>
            <button
              className="bg-rose-800 text-white font-medium tracking-wider py-2 px-10 rounded-lg shadow-md hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-opacity-50"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

      </div>

      <div className="mt-5 ant-table rounded-xl shadow-xl">
        {tableData ? (
          <Table data={currentData} columns={columns} loading={tableLoader} isFiltered={isFiltered} />
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

      {/* Pass the selectedStudentData to BatchJobDetails */}
      <BatchJobDetails
        visible={isModalVisible}
        onCancel={handleCancel}
        selectedStudentData={selectedStudentData}
      />
    </div>
  );
};

export default BatchJob;
