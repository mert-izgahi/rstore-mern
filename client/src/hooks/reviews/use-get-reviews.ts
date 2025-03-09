import { IDataWithPagination, IReview } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/axios";
interface IGetIReviewsState {
  isLoading: boolean;
  error: string | null;
  data: IDataWithPagination<IReview>;
  getReviews: (query: string) => Promise<IDataWithPagination<IReview>>;
}

export const useGetReviews = create<IGetIReviewsState>()((set) => ({
  isLoading: false,
  error: null,
  data: {
    records: [],
    pagination: {
      page: 0,
      limit: 0,
      pages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    page: 0,
    limit: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  getReviews: (query) => {
    return new Promise<IDataWithPagination<IReview>>((resolve, reject) => {
      set({ isLoading: true, error: null });
      api
        .get(`/api/get-reviews?${query}`)
        .then(async (res) => {
          const { data } = await res.data;
          set({ isLoading: false, data });
          resolve(data);
        })
        .catch((err) => {
          set({ isLoading: false, error: err.message });
          reject(err);
        });
    });
  },
}));
