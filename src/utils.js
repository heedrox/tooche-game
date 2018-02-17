/* eslint-disable import/prefer-default-export */
export const centerGameObjects = (objects) => {
  objects.forEach((object) => {
    object.anchor.setTo(0.5);
  });
};
