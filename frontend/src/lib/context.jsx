import React, { createContext, useEffect, useContext, useState } from "react";
import { notify } from "./../App";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [allResources, setAllResources] = useState([]);
  const [uniqueAvailableResources, setUniqueAvailableResources] = useState([]);
  const [bookingModalVisibility, setBookingModalVisibility] = useState(false);
  const [currentResource, setCurrentResource] = useState("");
  const [startTime, setStartTime] = useState("");
  const [userDetails, setUserDetails] = useState({ name: "", flat: "" });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [uniqueResourcesbooked, setUniqueResourcesbooked] = useState([]);
  const [uniqueExistingResources, setUniqueExistingResources] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [createResourceModalVisibility, setCreateResourceModalVisibility] =
    useState(false);
  const [fetchAllResource, setFetchAllResources] = useState(false);
  const [pushingToDb, setPushingToDb] = useState(false);
  const [fetchingResources, setFetchingResources] = useState(false);
  const [fetchingAllBookings, setFetchingAllBookings] = useState(false);
  const [fetchingUniqueBookings, setFetchingUniqueBookings] = useState(false);

  useEffect(() => {
    setFetchingResources(true);
    try {
      const resources = fetch(
        "http://localhost:8000/api/routes/records-rt/uniqueExistingResources",
        { mode: "cors" },
        { method: "GET" }
      )
        .then((response) => response.json())
        .then((data) => {
          setUniqueExistingResources(data);
        });
    } catch (err) {
      console.log(err);
    }
    setTimeout(() => {
      setFetchingResources(false);
    }, 500);
  }, [fetchAllResource]);

  useEffect(() => {
    console.log(fetchingResources);
  }, [fetchingResources]);

  useEffect(() => {
    try {
      const resources = fetch(
        "http://localhost:8000/api/routes/records-rt/allResources",
        { mode: "cors" },
        { method: "GET" }
      )
        .then((response) => response.json())
        .then((data) => {
          setAllResources(data);
        });
    } catch (err) {
      console.log(err);
    }
  }, [fetchAllResource]);

  useEffect(() => {
    setFetchingAllBookings(true);
    try {
      const resources = fetch(
        "http://localhost:8000/api/routes/records-rt/allBookings",
        { mode: "cors" },
        { method: "GET" }
      )
        .then((response) => response.json())
        .then((data) => {
          setAllBookings(data);
        });
    } catch (err) {
      console.log(err);
    }
    setTimeout(() => {
      setFetchingAllBookings(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setFetchingUniqueBookings(true);
    try {
      const resources = fetch(
        "http://localhost:8000/api/routes/records-rt/uniqueResourcesBooked",
        { mode: "cors" },
        { method: "GET" }
      )
        .then((response) => response.json())
        .then((data) => {
          setUniqueResourcesbooked(data);
        });
    } catch (err) {
      console.log(err);
    }
    setTimeout(() => {
      setFetchingUniqueBookings(false);
    }, 500);
  }, []);

  useEffect(() => {
    try {
      const resources = fetch(
        "http://localhost:8000/api/routes/records-rt/uniqueAvailableResources",
        { mode: "cors" },
        { method: "GET" }
      )
        .then((response) => response.json())
        .then((data) => {
          setUniqueAvailableResources(data);
        });
    } catch (err) {
      console.log(err);
    }
  }, [fetchAllResource]);

  useEffect(() => {
    console.log(availableTimeSlots);
  }, [availableTimeSlots]);

  const updateCurrentResource = (resourceName) => {
    setCurrentResource(resourceName);
  };

  const updateStartTime = (time) => {
    setStartTime(time);
  };

  const resetValues = () => {
    setCurrentResource("");
    setStartTime("");
    setAvailableTimeSlots([]);
  };

  const updateUserDetails = () => {
    ////setup endpoint connection here using useEffect based on login details
  };

  const pushBooking = (slot) => {
    //post data to insertBooking route
    let document = {};
    document.resource = currentResource;
    // const userDetails = await;
    //create endpoint to fetch 2 details below
    // document.flat = booking.flat; -get from users collection
    // document.name = booking.name; -get from users collection
    const slotBreakup = slot.split(" ");
    if (
      slotBreakup[1] == "AM" ||
      (slotBreakup[0] == "12" && slotBreakup[1] == "PM")
    ) {
      document.startTime = slotBreakup[0];
    } else {
      document.startTime = parseInt(slotBreakup[0]) + 12 + "";
    }
    document.endTime = parseInt(document.startTime) + 1 + "";
    document.bookingTimeStamp = new Date().toISOString();
    console.log(document);
  };

  const updateCreateResourceVisibility = () => {
    setCreateResourceModalVisibility((state) => {
      return !state;
    });
  };

  const updateBookingModalVisibility = () => {
    setBookingModalVisibility((state) => {
      return !state;
    });
  };

  const updateAvailableTimeSlots = (resource) => {
    let resourceTimings = [];
    for (let i = 0; i < allResources.length; i++) {
      let begin = "",
        end = "";
      if (allResources[i].resource === resource) {
        if (+allResources[i].startTime > 12) {
          begin = +allResources[i].startTime - 12 + " PM";
        } else if (+allResources[i].startTime < 12) {
          begin = +allResources[i].startTime + " AM";
        } else {
          begin = "12 PM";
        }
        if (allResources[i].endTime > 12) {
          end = +allResources[i].endTime - 12 + " PM";
        } else if (+allResources[i].endTime < 12) {
          end = +allResources[i].endTime + " AM";
        } else {
          end = "12 PM";
        }
        resourceTimings.push([begin, end]);
      }
    }
    setAvailableTimeSlots(resourceTimings);
  };

  const createNewResource = async (resource) => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    resource.date = month + "/" + day + "/" + year;
    setPushingToDb(true);
    try {
      await fetch(
        "http://localhost:8000/api/routes/records-rt/createNewResource",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify the content type
            // Add any other headers your API requires
          },
          body: JSON.stringify(resource), // Convert your data to JSON format
        }
      )
        .then((response) => response.json()) // Process the response
        .then((result) => {
          notify(result);
        })
        .catch((error) => {
          notify("Resource creation failed. Please try again!");
        });
      setFetchAllResources((state) => {
        return !state;
      });
    } catch (err) {
      console.log(err);
    }
    setPushingToDb(false);
    setCreateResourceModalVisibility(false);
  };

  return (
    <Context.Provider
      value={{
        allResources,
        allBookings,
        uniqueExistingResources,
        uniqueResourcesbooked,
        fetchingUniqueBookings,
        uniqueAvailableResources,
        bookingModalVisibility,
        currentResource,
        startTime,
        availableTimeSlots,
        pushingToDb,
        createResourceModalVisibility,
        fetchingResources,
        fetchingAllBookings,
        updateAvailableTimeSlots,
        createNewResource,
        pushBooking,
        updateStartTime,
        updateCurrentResource,
        updateCreateResourceVisibility,
        updateBookingModalVisibility,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export const useStateContext = () => useContext(Context);
