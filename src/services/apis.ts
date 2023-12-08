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

interface PayloadZipCodeTree {
  stateCode?: string
  countyName?: string
  cityName?: string
}
// API auth
export const loginApi = (params: any) =>
  axiosInstance.post('/auth/login', params)
export const logoutApi = () => axiosInstance.get('/auth/logout')
export const whoAmI = () => axiosInstance.get('/auth/profile')
export const registerApi = (params: any) =>
  axiosInstance.post('/auth/signup', params)
export const updateSettingApi = (payload: any) =>
  axiosInstance.put('/settings', payload)

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

// API categories
export const getCategoriesApi = (payload: FetchDto) =>
  axiosInstance.get(`/categories?${queryString.stringify(payload)}`)
export const getCategoryListApi = () => axiosInstance.get('/categories/list')
export const getCategoryApi = (id: string) =>
  axiosInstance.get(`/categories/${id}`)
export const updateCategoryApi = (id: string, params: any) =>
  axiosInstance.put(`/categories/${id}`, params)
export const createCategoryApi = (params: any) =>
  axiosInstance.post('/categories', params)
export const deleteCategoryApi = (id: string) =>
  axiosInstance.delete(`/categories/${id}`)

// API business
export const getBusinessApi = (payload: FetchDto) =>
  axiosInstance.get(`/business?${queryString.stringify(payload)}`)
export const getBusinessIdApi = (id: string) =>
  axiosInstance.get(`/business/${id}`)
export const updateBusinessApi = (id: string, params: any) =>
  axiosInstance.put(`/business/${id}`, params)
export const createBusinessApi = (params: any) =>
  axiosInstance.post(`/business`, params)
export const deleteBusinessApi = (id: string) =>
  axiosInstance.delete(`/business/${id}`)
export const verifyBusinessApi = (id: string, params: any) =>
  axiosInstance.put(`/business/verify/${id}`, params)

// API job
export const getScratchsApi = (payload: FetchDto) =>
  axiosInstance.get(`/job?${queryString.stringify(payload)}`)
export const getScratchApi = (id: string) => axiosInstance.get(`/job/${id}`)
export const scratchProcessApi = (params: any) =>
  axiosInstance.post('/job/search', params)
export const scratchReProcessApi = (id: string) =>
  axiosInstance.post(`/job/re-process/${id}`)
export const deleteScratchApi = (id: string) =>
  axiosInstance.delete(`/job/${id}`)
export const scratchVerifileGoogleApi = (payload: any) =>
  axiosInstance.get(`/job/verifile-google?${queryString.stringify(payload)}`)

// API zipcode
export const getZipCodesApi = (payload: FetchDto) =>
  axiosInstance.get(`/zipCode?${queryString.stringify(payload)}`)
export const getZipCodeTreeApi = (payload: PayloadZipCodeTree) =>
  axiosInstance.get(`/zipCode/tree?${queryString.stringify(payload)}`)

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

// API export
export const exportBusinessApi = (payload: any) =>
  axiosInstance.get(`/export/business?${queryString.stringify(payload)}`)

// API files
export const getFilesApi = (payload: any) =>
  axiosInstance.get(`/files?${queryString.stringify(payload)}`)
export const getFileApi = (id: string) => axiosInstance.get(`/files/${id}`)
export const deleteFileApi = (id: string) =>
  axiosInstance.delete(`/files/${id}`)
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
