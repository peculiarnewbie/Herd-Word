'use client'
import { useEffect, useState } from 'react';

//@ts-ignore
const CustomForm = ({ onClick }) => {
    //@ts-ignore
    const CallCreateRoom = async (event) => {
        event.preventDefault();
        console.log("called")
        console.log(event.target.room.value, event.target.name.value)

        await onClick(event.target.room.value, event.target.name.value);
    }
  // this effect runs only in the browser
  // useEffect(() => {
  //   // add event listener to the document
  //   document.addEventListener('click', onClick);

  //   // clean up function
  //   return () => {
  //     document.removeEventListener('click', onClick);
  //   };
  // }, [onClick]);

  return (
    <form onSubmit={CallCreateRoom}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="name">Room</label>
      <input type="text" id="roomName" name="room" required />
        <button type="submit">Add to Cart</button>
      </form>
  );
};

export default CustomForm;
