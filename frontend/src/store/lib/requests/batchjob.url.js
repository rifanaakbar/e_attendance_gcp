export const getAllBatchJobConfig = () => ({
    url: `/batchjob_id`,
});

export const getBatchJobRetryConfig = () => ({
    url: `/batch_job?job_type=retry`,
});