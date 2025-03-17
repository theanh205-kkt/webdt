/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { IProduct } from "../interface/type";

const API_URL = "http://localhost:3000";
// const API_URL = "https://api.fake-rest.refine.dev";

type getListParams = {
  resource: string;
};

type createParams = {
  resource: string;
  variables: Omit<IProduct, "id">;
};

type updateParams = {
  resource: string;
  variables: IProduct;
  id: number;
};

type getOneParams = {
  resource: string;
  id: number;
};

type deleteParams = {
  resource: string;
  id: number;
};

const dataProvider = {
  getList: async ({ resource }: getListParams) => {
    try {
      const response = await axios.get(`${API_URL}/${resource}`);
      if (response.status !== 200) new Error("Error");

      return {
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  },
  getOne: async ({ resource, id }: getOneParams) => {
    try {
      const response = await axios.get(`${API_URL}/${resource}/${id}`);
      if (response.status !== 200) new Error("Error");

      return {
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  },
  create: async ({ resource, variables }: createParams) => {
    try {
      const response = await axios.post(`${API_URL}/${resource}`, variables);
      if (response.status !== 201) new Error("Error");

      return {
        success: true,
        // data: response.data,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  },
  update: async ({ resource, variables, id }: updateParams) => {
    try {
      const response = await axios.put(
        `${API_URL}/${resource}/${id}`,
        variables
      );
      if (response.status !== 200) new Error("Error");

      return {
        success: true,
        // data: response.data,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  },
  remove: async ({ resource, id }: deleteParams) => {
    try {
      const response = await axios.delete(`${API_URL}/${resource}/${id}`);
      if (response.status !== 200) new Error("Error");

      return {
        success: true,
        // data: response.data,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  },
};

export const { getList, getOne, create, update, remove } = dataProvider;
