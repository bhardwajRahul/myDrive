import { QueryFunctionContext } from "react-query";
import axios from "../axiosInterceptor";
import { getUserToken } from "./user";

interface QueryKeyParams {
  parent: string;
  search?: string;
  sortBy?: string;
  limit?: number;
  startAtDate?: string;
  startAtName?: string;
  startAt?: boolean;
}

// GET

export const getFilesList = async ({
  queryKey,
  pageParam,
}: QueryFunctionContext<[string, QueryKeyParams]>) => {
  const [
    _key,
    { parent = "/", search = "", sortBy = "date_desc", limit = 50 },
  ] = queryKey;

  const queryParams: QueryKeyParams = {
    parent,
    search,
    sortBy,
    limit,
  };

  if (pageParam?.startAtDate && pageParam?.startAtName) {
    queryParams.startAtDate = pageParam.startAtDate;
    queryParams.startAtName = pageParam.startAtName;
    queryParams.startAt = true;
  }

  const response = await axios.get(`/file-service/list`, {
    params: queryParams,
  });
  return response.data;
};

export const getQuickFilesList = async () => {
  const response = await axios.get(`/file-service/quick-list`, {
    params: {
      limit: 20,
    },
  });
  return response.data;
};

export const downloadFile = async (fileID: string) => {
  await getUserToken();

  // TODO: Change this
  const url = `http://localhost:5173/api/file-service/download/${fileID}`;

  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = url;
  link.setAttribute("type", "hidden");
  link.setAttribute("download", "true");
  link.click();
};

export const getFileThumbnail = async (thumbnailID: string) => {
  // TODO: Change this
  const url = `http://localhost:5173/api/file-service/thumbnail/${thumbnailID}`;
  const config = {
    responseType: "arraybuffer",
  };

  const response = await axios.get(url, config);

  const imgFile = new Blob([response.data]);
  const imgUrl = URL.createObjectURL(imgFile);

  return imgUrl;
};

// PATCH
export const renameFile = async (fileID: string, name: string) => {
  const response = await axios.patch(`/file-service/rename`, {
    id: fileID,
    title: name,
  });
  return response.data;
};

// DELETE
export const deleteFile = async (fileID: string) => {
  const response = await axios.delete(`/file-service/remove`, {
    data: {
      id: fileID,
    },
  });
  return response.data;
};
