'use strict';

const nanoid = require(`nanoid`);

const MAX_LENGHT_ANNOUNCE = 100;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getNewId = () => {
  return nanoid(6);
};

const deleteItemFromArray = (array, id) => {
  const idx = array.map((el) => el.id).indexOf(id);
  if (idx === -1) {
    return idx;
  }

  const beforeIdx = array.slice(0, idx);
  const afterIdx = array.slice(idx + 1);

  return [...beforeIdx, ...afterIdx];
};

const cutString = (data) => {
  return data.length > MAX_LENGHT_ANNOUNCE ? `${data.slice(0, MAX_LENGHT_ANNOUNCE)}...` : data;
};

const generateDate = (date, time) => {
  const createDate = !date ? new Date() : new Date(date);
  const tempMonth = `${createDate.getMonth() + 1}`.padStart(2, `00`);
  let result = `${createDate.getDate()}.${tempMonth}.${createDate.getFullYear()}`;
  if (time) {
    result = `${result}:${createDate.getMinutes()}`;
  }
  return result;
};


module.exports = {
  getRandomInt,
  shuffle,
  deleteItemFromArray,
  getNewId,
  cutString,
  generateDate,
};
