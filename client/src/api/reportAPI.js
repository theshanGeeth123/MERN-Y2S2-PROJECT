import axios from "axios";

const BASE_URL = "http://localhost:4000/api/report";

export const fetchUserSummary = () => axios.get(`${BASE_URL}/summary`);
export const fetchAgeDistribution = () => axios.get(`${BASE_URL}/age-distribution`);
export const fetchEmailDomainReport = () => axios.get(`${BASE_URL}/email-domains`);
