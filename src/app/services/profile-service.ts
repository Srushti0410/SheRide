import { apiClient, ApiError } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/api-config';
import { UserProfile } from '../context/AuthContext';

export interface ProfileResponse {
  id: string;
  userId: string;
  profile: UserProfile;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadResponse {
  url: string;
  verified: boolean;
  documentType: string;
}

export class ProfileService {
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.GET.replace(':userId', userId);
      return await apiClient.get<ProfileResponse>(endpoint);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async updateProfile(userId: string, profile: UserProfile): Promise<ProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.UPDATE.replace(':userId', userId);
      return await apiClient.put<ProfileResponse>(endpoint, profile);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async completeProfile(userId: string, profile: UserProfile): Promise<ProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.COMPLETE.replace(':userId', userId);
      return await apiClient.post<ProfileResponse>(endpoint, profile);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async uploadDocument(
    userId: string,
    file: File,
    docType: 'idProof' | 'insuranceProof' | 'profilePhoto'
  ): Promise<DocumentUploadResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.UPLOAD_DOCUMENT.replace(':userId', userId);
      return await apiClient.uploadFile<DocumentUploadResponse>(endpoint, file, {
        docType,
        userId
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}

export const profileService = new ProfileService();
