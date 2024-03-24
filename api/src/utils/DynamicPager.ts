export const dynamicPager = (page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;
  return { limit: pageSize, offset: offset };
};
