import React, { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Button,
  Input,
  CardFooter,
} from "@material-tailwind/react";

import Layout from "../../layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../base/BaseUrl";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const getData = () => {
    axios({
      url: `${BASE_URL}/api/fetch-profile`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setFirstName(res.data?.user.full_name);
        setPhone(res.data.user?.mobile);
        setEmail(res.data.user?.email);
      })
      .catch(() => {
        setLoader(false);
        toast.error("Failed to fetch profile data");
      });
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      window.location = "/";
    } else {
      getData();
    }
  }, []);
  const onUpdateProfile = (e) => {
    e.preventDefault();

    if (firstName === "") {
      NotificationManager.error("Enter Full Name");
      return false;
    }
    if (phone === "" || phone === "NaN") {
      NotificationManager.error("Enter Mobile Number");
      return false;
    }
    if (phone.length !== 10) {
      NotificationManager.error("Mobile Number allows only 10 Digits");
      return false;
    }
    if (email === "") {
      NotificationManager.error("Enter Email Id");
      return false;
    }

    const data = {
      first_name: firstName,
      phone: phone,
      email: email,
    };

    axios({
      url: `${BASE_URL}/api/update-profile`,

      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.data.code == "401") {
          toast.error("Duplicate Entry of Name");
        } else if (res.data.code == "402") {
          toast.error("Duplicate Entry of Mobile");
        } else if (res.data.code == "403") {
          toast.error("Duplicate Entry of Email");
        } else {
          toast.success("Profile Updated Successfully!");
        }
      })
      .catch(() => {
        toast.error("Profile not Updated");
      });
  };

  // Helper functions for input validation
  const validateOnlyText = (inputtxt) => {
    const re = /^[A-Za-z ]+$/;
    return inputtxt === "" || re.test(inputtxt);
  };

  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return inputtxt.match(phoneno) || inputtxt.length === 0;
  };

  // Handlers for input change with validation
  const handleFirstNameChange = (e) => {
    if (validateOnlyText(e.target.value)) {
      setFirstName(e.target.value);
    }
  };

  const handlePhoneChange = (e) => {
    if (validateOnlyDigits(e.target.value)) {
      setPhone(e.target.value);
    }
  };
  return (
    <Layout>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" className=" bg-gray-100 mb-4 p-6">
            <Typography variant="h6" color="black">
              Profile
            </Typography>
          </CardHeader>
          <CardBody className=" flex flex-row gap-4 ">
            {/* Name field */}

            <Input
              label="Name"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight "
              id="name"
              type="text"
              required
              value={firstName}
              onChange={handleFirstNameChange}
              placeholder="Enter your name"
            />

            {/* Mobile field */}

            <Input
              label="Mobile"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight "
              id="mobile"
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your mobile number"
            />

            {/* Email field */}

            <Input
              label="Email"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight "
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </CardBody>
          <CardFooter className="pt-0 flex justify-center">
            <Button
              onClick={onUpdateProfile}
              variant="gradient"
              color="blue"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
