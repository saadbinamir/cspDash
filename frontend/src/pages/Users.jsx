import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TeamDetA from "../common/TeamDetA";
import emailjs from "@emailjs/browser";
import LoadingBar from "react-top-loading-bar";

export default function Users() {
  const { teamId } = useParams();
  const auth = useAuth();
  const form = useRef();

  const [addUserEmail, setaddUserEmail] = useState([]);
  const [members, setmembers] = useState([]);
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const [key, setKey] = useState(0);
  const [progress, setProgress] = useState(0);

  function getTeamMembers(forceFetch = false) {
    setProgress(50);

    // Check if the data is cached in localStorage
    const cacheKey = `cachedTeamMembers_${teamId}`;
    const cachedTeamMembers = localStorage.getItem(cacheKey);

    if (!forceFetch && cachedTeamMembers) {
      const parsedTeamMembers = JSON.parse(cachedTeamMembers);
      setmembers(parsedTeamMembers.members);
      console.log("Data loaded from cache");

      // Now, initiate a background API call to fetch the latest data
      axios
        .post(`http://${auth.ip}:8000/api/getTeamMembers`, {
          unique_id: teamId,
        })
        .then((response) => {
          if (response.data.status === 200) {
            // Compare the data from the API with the cached data
            if (
              JSON.stringify(response.data.members) !==
              JSON.stringify(parsedTeamMembers.members)
            ) {
              console.log("Updating data from API response");

              // Update the number_of_members dynamically
              const numberOfMembers = response.data.members.length;
              // setNumberOfMembers(numberOfMembers);
              const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
              const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);
              const parsedTeamDetails = JSON.parse(cachedTeamDetails);
              parsedTeamDetails.team_details.number_of_members =
                numberOfMembers;

              // Update the cached data with the modified number_of_members
              const dataToCache = {
                members: response.data.members,
                numberOfMembers,
              };
              localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

              setmembers(response.data.members);
            }
          } else {
            setErr(response.data.message);
            setErrState(true);
            setTimeout(() => {
              setErr("");
              setErrState(false);
            }, 3000);
          }
        })
        .finally(() => {
          setProgress(100);
        });

      return; // Exit early to avoid rendering from API call response
    }

    // Fetch team members from the API if not found in the cache or forceFetch is true
    axios
      .post(`http://${auth.ip}:8000/api/getTeamMembers`, {
        unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          // Update the number_of_members dynamically
          const numberOfMembers = response.data.members.length;
          // setNumberOfMembers(numberOfMembers);
          const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
          const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);
          const parsedTeamDetails = JSON.parse(cachedTeamDetails);
          parsedTeamDetails.team_details.number_of_members = numberOfMembers;

          setmembers(response.data.members);

          // Cache the data in localStorage with team-specific key
          const dataToCache = {
            members: response.data.members,
            numberOfMembers,
          };
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

          console.log("API called, data cached");
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
        }
      })
      .finally(() => {
        setProgress(100);
      });
  }

  // function getTeamMembers(forceFetch = false) {
  //   setProgress(50);

  //   // Check if the data is cached in localStorage
  //   const cacheKey = `cachedTeamMembers_${teamId}`;
  //   const cachedTeamMembers = localStorage.getItem(cacheKey);

  //   if (!forceFetch && cachedTeamMembers) {
  //     const parsedTeamMembers = JSON.parse(cachedTeamMembers);
  //     setmembers(parsedTeamMembers.members);
  //     console.log("Data loaded from cache");

  //     // Now, initiate a background API call to fetch the latest data
  //     axios
  //       .post(`http://${auth.ip}:8000/api/getTeamMembers`, {
  //         unique_id: teamId,
  //       })
  //       .then((response) => {
  //         if (response.data.status === 200) {
  //           // Compare the data from the API with the cached data
  //           if (
  //             JSON.stringify(response.data.members) !==
  //             JSON.stringify(parsedTeamMembers.members)
  //           ) {
  //             console.log("Updating data from API response");
  //             setmembers(response.data.members);

  //             // Cache the updated data in localStorage with team-specific key
  //             const dataToCache = { members: response.data.members };
  //             localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  //           }
  //         } else {
  //           setErr(response.data.message);
  //           setErrState(true);
  //           setTimeout(() => {
  //             setErr("");
  //             setErrState(false);
  //           }, 3000);
  //         }
  //       })
  //       .finally(() => {
  //         setProgress(100);
  //       });

  //     return; // Exit early to avoid rendering from API call response
  //   }

  //   // Fetch team members from the API if not found in the cache or forceFetch is true
  //   axios
  //     .post(`http://${auth.ip}:8000/api/getTeamMembers`, {
  //       unique_id: teamId,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         setmembers(response.data.members);

  //         // Cache the data in localStorage with team-specific key
  //         const dataToCache = { members: response.data.members };
  //         localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

  //         console.log("API called, data cached");
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //       }
  //     })
  //     .finally(() => {
  //       setProgress(100);
  //     });
  // }

  // function getTeamMembers(forceFetch = false) {
  //   setProgress(50);

  //   // Check if the data is cached in localStorage
  //   const cacheKey = `cachedTeamMembers_${teamId}`;
  //   const cachedTeamMembers = localStorage.getItem(cacheKey);

  //   if (!forceFetch && cachedTeamMembers) {
  //     const parsedTeamMembers = JSON.parse(cachedTeamMembers);
  //     setmembers(parsedTeamMembers.members);
  //     console.log("Data loaded from cache");
  //     setProgress(100);
  //     return; // Exit early to avoid API call
  //   }

  //   // Fetch team members from the API if not found in the cache or forceFetch is true
  //   axios
  //     .post(`http://${auth.ip}:8000/api/getTeamMembers`, {
  //       unique_id: teamId,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         setmembers(response.data.members);

  //         // Cache the data in localStorage with team-specific key
  //         const dataToCache = { members: response.data.members };
  //         localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

  //         console.log("API called, data cached");
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //       }

  //       setProgress(100);
  //     });
  // }

  // function getTeamMembers() {
  //   setProgress(50);

  //   // Check if the data is cached in localStorage
  //   const cacheKey = `cachedTeamMembers_${teamId}`;
  //   const cachedTeamMembers = localStorage.getItem(cacheKey);

  //   if (cachedTeamMembers) {
  //     const parsedTeamMembers = JSON.parse(cachedTeamMembers);
  //     setmembers(parsedTeamMembers.members);
  //     console.log("Data loaded from cache");
  //     setProgress(100);
  //     return; // Exit early to avoid API call
  //   }

  //   // Fetch team members from the API if not found in the cache
  //   axios
  //     .post(`http://${auth.ip}:8000/api/getTeamMembers`, {
  //       unique_id: teamId,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         setmembers(response.data.members);

  //         // Cache the data in localStorage with team-specific key
  //         const dataToCache = { members: response.data.members };
  //         localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

  //         console.log("API called, data cached");
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //       }

  //       setProgress(100);
  //     });
  // }

  //before caching

  // function getTeamMembers() {
  //   setProgress(50);
  //   axios
  //     .post(`http://${auth.ip}:8000/api/getTeamMembers`, {
  //       unique_id: teamId,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         setmembers(response.data.members);
  //         console.log(response.data.members);
  //         setProgress(100);
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //       }
  //     });
  // }

  const AddMember = (e) => {
    e.preventDefault();
    setProgress(50);
    if (!addUserEmail) {
      setErr("Enter a user email");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        .post(`http://${auth.ip}:8000/api/addUserToTeam`, {
          email: addUserEmail,
          unique_id: teamId,
        })
        .then((response) => {
          if (response.data.status === 201) {
            console.log(response.data.message);
            setErr(response.data.message);
            setErrState(false);
            // getTeamMembers();

            // Update the number_of_members in the cached team data
            const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
            const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);

            if (cachedTeamDetails) {
              const parsedTeamDetails = JSON.parse(cachedTeamDetails);
              parsedTeamDetails.team_details.number_of_members += 1;

              // Update the cache with the modified data
              localStorage.setItem(
                cacheKeyDetails,
                JSON.stringify(parsedTeamDetails)
              );

              console.log("Number of members updated in cache");
            }

            getTeamMembers(true);

            setKey(key + 1);
            form.current.user_name.value = response.data.name;
            form.current.user_email.value = response.data.user_email;
            emailjs
              .sendForm(
                "service_xrb4dfl",
                "template_rbw1zyf",
                form.current,
                "wP7G7RotSIre32n7L"
              )
              .then(
                (result) => {
                  console.log(result.text);
                },
                (error) => {
                  console.log(error.text);
                }
              );
            setProgress(100);
          } else {
            setErr(response.data.message);
            setErrState(true);
            setTimeout(() => {
              setErr("");
              setErrState(false);
            }, 3000);
            setProgress(100);
          }
        });
    }
  };

  function RemoveMember(userEmail) {
    setProgress(50);
    const requestData = {
      email: userEmail,
      unique_id: teamId,
    };

    axios
      .delete(`http://${auth.ip}:8000/api/removeUserFromTeam`, {
        data: requestData,
      })
      .then((response) => {
        if (response.data.status === 200) {
          console.log(response.data.message);
          setErr(response.data.message);
          setErrState(false);

          // Update the number_of_members in the cached team data
          const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
          const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);

          if (cachedTeamDetails) {
            const parsedTeamDetails = JSON.parse(cachedTeamDetails);
            parsedTeamDetails.team_details.number_of_members -= 1;

            // Update the cache with the modified data
            localStorage.setItem(
              cacheKeyDetails,
              JSON.stringify(parsedTeamDetails)
            );

            console.log("Number of members updated in cache");
          }

          // Remove the user from the cached team members data
          const cacheKeyMembers = `cachedTeamMembers_${teamId}`;
          const cachedTeamMembers = localStorage.getItem(cacheKeyMembers);

          if (cachedTeamMembers) {
            const parsedTeamMembers = JSON.parse(cachedTeamMembers);

            // Ensure userEmail is a string for comparison
            const userEmailString = userEmail.toString();

            const updatedMembers = parsedTeamMembers.members.filter(
              (member) => member.team_member_email !== userEmailString
            );

            // Update the cache with the modified data
            const dataToCache = { members: updatedMembers };
            localStorage.setItem(cacheKeyMembers, JSON.stringify(dataToCache));
          }

          getTeamMembers(); // Refresh the team members without API call

          setKey(key + 1);
          setProgress(100);
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
          setProgress(100);
        }
      });
  }

  // function RemoveMember(userEmail) {
  //   setProgress(50);
  //   const requestData = {
  //     email: userEmail,
  //     unique_id: teamId,
  //   };

  //   axios
  //     .delete(`http://${auth.ip}:8000/api/removeUserFromTeam`, {
  //       data: requestData,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         console.log(response.data.message);
  //         setErr(response.data.message);
  //         setErrState(false);

  //         // Remove the user from the cached data
  //         const cacheKey = `cachedTeamMembers_${teamId}`;
  //         const cachedTeamMembers = localStorage.getItem(cacheKey);

  //         if (cachedTeamMembers) {
  //           const parsedTeamMembers = JSON.parse(cachedTeamMembers);

  //           // Ensure userEmail is a string for comparison
  //           const userEmailString = userEmail.toString();

  //           const updatedMembers = parsedTeamMembers.members.filter(
  //             (member) => member.team_member_email !== userEmailString
  //           );

  //           // Update the cache with the modified data
  //           const dataToCache = { members: updatedMembers };
  //           localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  //         }

  //         getTeamMembers();

  //         setKey(key + 1);
  //         setProgress(100);
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //         setProgress(100);
  //       }
  //     });
  // }

  useEffect(() => {
    getTeamMembers();
  }, []);
  return (
    <>
      <LoadingBar
        color="#C39601"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar />
      <Toast err={err} errState={errState} />
      <div className="container mx-auto max-w-screen-xl flex flex-col gap-y-10  py-10">
        {/* <TeamDetA /> */}
        <TeamDetA key={key} />

        <div className=" flex flex-row gap-x-10  justify-center items-start">
          <table className="w-full text-sm text-left  dark:text-gray-400 rounded-2xl overflow-hidden">
            <thead
              className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b border-opacity-50"
              style={{ backgroundColor: "#2f2f2f" }}
            >
              <tr>
                <th scope="col" className="px-2 py-3">
                  Sr.
                </th>
                <th scope="col" className="px-2 py-3">
                  Name
                </th>
                <th scope="col" className="px-2 py-3">
                  Enrollment
                </th>
                <th scope="col" className="px-2 py-3">
                  Phone
                </th>
                <th scope="col" className="px-2 py-3 flex flex-row">
                  Credit hours
                  <div
                    className="text-black text-center rounded-full px-3 mx-3"
                    style={{
                      backgroundColor: "#C39601",
                    }}
                  >
                    This team
                  </div>
                </th>
                {/* <th scope="col" className="px-2 py-3">
                  Role
                </th> */}
                <th scope="col" className="px-2 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr
                  key={member.team_member_email}
                  className={`border-b dark:border-gray-700 `}
                  style={{ backgroundColor: "#2f2f2f" }}
                >
                  <td className="px-2 py-4 ">{index + 1}</td>
                  <td className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {member.team_member_name}
                  </td>
                  <td className="px-2 py-4">
                    {member.team_member_email.split("@")[0]}
                  </td>
                  <td className="px-2 py-4">{member.team_member_phone}</td>

                  <td
                    className="ml-2 my-4 bg-black flex flex-row items-center rounded-full overflow-clip"
                    style={{ width: "300px", marginRight: "-50px" }}
                  >
                    <div
                      className="text-black text-center"
                      style={{
                        width: `${(member.team_credit_hours / 40) * 300}px`,
                        backgroundColor: "#C39601",
                        borderRadius: "50px 0 0 50px",
                      }}
                    >
                      {member.team_credit_hours > 0
                        ? member.team_credit_hours - 0
                        : ""}
                    </div>
                    <div
                      className="text-white text-center"
                      style={{
                        width: `${
                          ((member.total_credit_hours -
                            member.team_credit_hours) /
                            40) *
                          300
                        }px`,
                        backgroundColor: "#2F2F2F",
                        borderRadius: "0 50px 50px 0",
                      }}
                    >
                      {member.total_credit_hours - member.team_credit_hours}
                    </div>
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => RemoveMember(member.team_member_email)}
                      className="text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className=" space-y-4 rounded-2xl p-5 w-96 sticky top-10"
            style={{ backgroundColor: "#2F2F2F" }}
          >
            <h1
              className="text-xl leading-tight tracking-tight  md:text-2xl "
              style={{ color: "#C39601" }}
            >
              Add a member to the team
            </h1>
            <form
              ref={form}
              className="space-y-4 md:space-y-2"
              onSubmit={AddMember}
            >
              <div>
                <input type="hidden" name="user_name" value={addUserEmail} />
                <input type="hidden" name="team_name" value={teamId} />
                <label
                  htmlFor="teamID"
                  className="block mb-2 text-sm font-medium mt-2"
                  style={{ color: "#F6F6F6" }}
                >
                  User Email
                </label>
                <input
                  type="text"
                  name="user_email"
                  id="teamID"
                  className="sm:text-sm rounded-2xl w-full px-4 py-2"
                  style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                  placeholder="user@example.com"
                  value={addUserEmail}
                  onChange={(e) => setaddUserEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="py-1 rounded-2xl w-full mt-2"
                  style={{
                    color: "#C39601",
                    transition: "1ms",
                    border: "2px solid #C39601",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#C39601";
                    e.target.style.color = "#111111";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "initial";
                    e.target.style.color = "#C39601";
                  }}
                >
                  Add member
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
