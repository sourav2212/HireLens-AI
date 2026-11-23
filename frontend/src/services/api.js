
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 120000,
});

export const rankCandidates = async (jobDescription, files) => {
  const formData = new FormData();

  formData.append("job_description", jobDescription);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post(
    "/api/rank-candidates",
    formData
  );

  return response.data;
};

export default api;
