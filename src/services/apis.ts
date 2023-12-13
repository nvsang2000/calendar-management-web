import axiosInstance from '../utils/axios'
import queryString from 'query-string'

interface UploadProps {
  url: string
  id: string
}

interface FetchDto {
  search?: string
  page?: number
  limit?: number
}

// API policy
export const getPoliciesApi = (payload: FetchDto & { isActive?: boolean }) =>
  axiosInstance.get(`policies?${queryString.stringify(payload)}`)
export const getPolicyListApi = (payload: FetchDto & { isActive?: boolean }) =>
  axiosInstance.get(`policies/list?${queryString.stringify(payload)}`)
export const getPolicyApi = (id: number) => axiosInstance.get(`/policies/${id}`)
export const createPolicyApi = (payload: any) =>
  axiosInstance.post('/policies', payload)
export const updatePolicyApi = (id: number, payload: any) =>
  axiosInstance.put(`/policies/${+id}`, payload)
export const removePolicyApi = (id: number) =>
  axiosInstance.delete(`/policies/${+id}`)
export const getPermissionSubjectsApi = () =>
  axiosInstance.get('/policies/subjects')

// API auth
export const loginApi = (params: any) =>
  axiosInstance.post('/auth/login', params)
export const logoutApi = () => axiosInstance.get('/auth/logout')
export const whoAmI = () => axiosInstance.get('/auth/profile')
export const registerApi = (params: any) =>
  axiosInstance.post('/auth/signup', params)

// API user
export const getAllUserApi = (payload: FetchDto) =>
  axiosInstance.get(`/users?${queryString.stringify(payload)}`)
export const getUserApi = (id: string) => axiosInstance.get(`/users/${id}`)
export const deleteUserApi = (id: string) =>
  axiosInstance.delete(`/users/${id}`)
export const updateUserApi = (id: string, params: any) =>
  axiosInstance.put(`/users/${id}`, params)
export const createUserApi = (params: any) =>
  axiosInstance.post('/users', params)

// API staff
export const getAllStaffApi = (payload: FetchDto) =>
  axiosInstance.get(`/staffs?${queryString.stringify(payload)}`)
export const getStaffListApi = (payload: FetchDto) =>
  axiosInstance.get(`/staffs/list?${queryString.stringify(payload)}`)
export const getStaffApi = (id: string) => axiosInstance.get(`/staffs/${id}`)
export const deleteStaffApi = (id: string) =>
  axiosInstance.delete(`/staffs/${id}`)
export const updateStaffApi = (id: string, params: any) =>
  axiosInstance.put(`/staffs/${id}`, params)
export const createStaffApi = (params: any) =>
  axiosInstance.post('/staffs', params)

// API group
export const getAllGroupApi = (payload: FetchDto) =>
  axiosInstance.get(`/groups?${queryString.stringify(payload)}`)
export const getGroupApi = (id: string) => axiosInstance.get(`/groups/${id}`)
export const deleteGroupApi = (id: string) =>
  axiosInstance.delete(`/groups/${id}`)
export const updateGroupApi = (id: string, params: any) =>
  axiosInstance.put(`/groups/${id}`, params)
export const createGroupApi = (params: any) =>
  axiosInstance.post('/groups', params)

// API form
export const getAllFormApi = (payload: FetchDto) =>
  axiosInstance.get(`/forms?${queryString.stringify(payload)}`)
export const getFormApi = (id: string) => axiosInstance.get(`/forms/${id}`)
export const deleteFormApi = (id: string) =>
  axiosInstance.delete(`/forms/${id}`)
export const updateFormApi = (id: string, params: any) =>
  axiosInstance.put(`/forms/${id}`, params)
export const createFormApi = (params: any) =>
  axiosInstance.post('/forms', params)

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)

  return axiosInstance
    .post('/files/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(({ data }): UploadProps => {
      return { url: data?.url, id: data?.id }
    })
    .catch((err) => {
      console.log('hmm ', err)
    })
}
