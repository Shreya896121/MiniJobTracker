import type { Application, CreateApplicationInput, UpdateApplicationInput } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchApplications(params?: {
  status?: string;
  search?: string;
}): Promise<Application[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.search) queryParams.append("search", params.search);

  const res = await fetch(`${API_URL}/applications?${queryParams.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  const result = await res.json();
  return result.data;
}

export async function fetchApplicationById(id: string): Promise<Application> {
  const res = await fetch(`${API_URL}/applications/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch application with ID ${id}`);
  }

  const result = await res.json();
  return result.data;
}

export async function createApplication(data: CreateApplicationInput): Promise<Application> {
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create application");
  }

  const result = await res.json();
  return result.data;
}

export async function updateApplication(id: string, data: UpdateApplicationInput): Promise<Application> {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update application");
  }

  const result = await res.json();
  return result.data;
}

export async function deleteApplication(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete application");
  }
}
