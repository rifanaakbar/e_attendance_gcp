import { showToastError } from "../../utilities/errortoast";
import { showToastSuccess } from "../../utilities/toast";
import { axios } from "../lib/axios";
import { getAllBatchJobConfig, getBatchJobRetryConfig } from "../lib/requests/batchjob.url";
import { batchDataOptionsSlice, batchDataSlice } from "../slices/batchjob.slice";
import { moduleLoading } from "../slices/module.slice";

export const getAllBatchJob = (payload, findFilter) => {
    return async (dispatch) => {
        findFilter === "filter" ? dispatch(moduleLoading(false)) : dispatch(moduleLoading(true))
        try {
            const { url } = getAllBatchJobConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.post(url, payload, { headers });
            const response = result?.data
            if (result?.status === 200 && response) {
                findFilter === "filter" ? dispatch(batchDataOptionsSlice(response)) : dispatch(batchDataSlice(response))
                dispatch(moduleLoading(false));
                return response;
            }
        } catch (e) {
            showToastError("An error occurred");
            dispatch(moduleLoading(false));
            throw e;
        }
    };
};

export const getBatchJobRetry = (payload) => {
    return async (dispatch) => {
        try {
            const { url } = getBatchJobRetryConfig();
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const result = await axios.post(url, payload, { headers });
            const response = result?.data
            if (result?.status === 200 && response) {
            }
        } catch (e) {
            showToastError("An error occurred");
        }
    };
};