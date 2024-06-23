import api from "@/utils/api";

function getList(limit, offset) {
  return api.get(`pokemon/?offset=${offset}&limit=${limit}`);
}

function getItem(name) {
  return api.get(`pokemon/${name}`);
}

export default {
  getList,
  getItem,
};
