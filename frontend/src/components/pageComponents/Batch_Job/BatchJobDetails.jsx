import React, { useState } from "react";
import { Modal, Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getBatchJobRetry } from "../../../store/actions/batchjob.action";
import moment from "moment";

const BatchJobDetails = ({ visible, onCancel }) => {
  const { allBatchData } = useSelector((state) => state?.batchState);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();


  // Extract the first batch job data
  const batchJob = allBatchData?.[0] || {};
  const failedReports = batchJob?.failed_reports || [];

  // Determine retry_type based on batchjob_name
  let retryType = "";
  if (batchJob.batchjob_name?.toLowerCase().startsWith("blackboard")) {
    retryType = "blackboard";
  } else if (batchJob.batchjob_name?.toLowerCase().startsWith("gantry")) {
    retryType = "gantry";
  }

  // Convert batchjob_date to UTC format
  const retryDate = moment
    .utc(batchJob.batchjob_date, "YYYY-MM-DD")
    .format("YYYY-MM-DDT00:00:00.000[Z]");

    const handleRetry = async () => {
      setLoading(true);
      const payload = {
        retry_type: retryType,
        retry_date: retryDate
      };
      await dispatch(getBatchJobRetry(payload));
      setLoading(false);
    };

    const buttonStyle = {
      backgroundColor: loading || failedReports.length === 0 ? '#be123c' : '',
      color: 'white',
      borderColor: loading || failedReports.length === 0 ? '#be123c' : '',
    };

  return (
    <Modal
      title={
        <div className="text-center">
          <p className="font-sans font-semibold text-2xl">Batch Job Details</p>
        </div>
      }
      visible={visible}
      className={`batchjob-modal`}
      onCancel={onCancel}
      footer={null}
      centered={true}
      maskClosable={false}
    >

<div className="flex justify-end mt-6">
<Button
          type="primary"
          icon={loading ? <Spin indicator={<ReloadOutlined />} /> : <ReloadOutlined />}
          onClick={handleRetry}
          loading={loading}
          disabled={failedReports?.length === 0 || loading} 
          style={buttonStyle}
        >
          <div className="font-medium">{loading ? "Retrying..." : "Retry"}</div>
        </Button>
      </div>
      <div className="font-sans mt-8">
        {/* Header Row */}
        <div className="flex justify-between font-semibold mb-4 border-b pb-2">
          <p className="w-1/3">Student ID</p>
          <p className="w-2/3">Reason</p>
        </div>

        {/* Check if there are failed reports */}
        {failedReports.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          failedReports.map((report, index) => (
            <div key={index} className="flex justify-between mb-4">
              <p className="w-1/3">{report.student_id || "N/A"}</p>
              <p className="w-2/3">{report.reason || "N/A"}</p>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default BatchJobDetails;
