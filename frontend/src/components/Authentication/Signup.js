import React from 'react';
import { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/toast";
import axios from 'axios';
import { useHistory } from "react-router";

const Signup = () => {


    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const toast = useToast();
    const history = useHistory();

   
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show);

    
    const postDetails = (pics) => {
    
        setPicLoading(true);
        
        // check if pic is undefined

        if (pics === undefined) {
            toast({     // if it's undefined, we pop up an error, this toast is from chakraUI
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

      //  console.log(pics);

        // we are checking if it's an image of req format
        
        if (pics.type === "image/jpeg" || pics.type === "image/png") {

            // just uploading photo in cloudinary

            const data = new FormData();

            data.append("file", pics);
            data.append("upload_preset", "Chat_application");
            data.append("cloud_name", "dd7wuoelv");

            fetch("https://api.cloudinary.com/v1_1/dd7wuoelv/image/upload", {
                method: "post",
                body: data,
            })
                // we are converting the response to json

                .then((res) => res.json())
                
                // and then we setpic

                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setPicLoading(false);
                })

                .catch((err) => {
                console.log(err);
                setPicLoading(false);
                });

        } else {

        toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",

        });
        setPicLoading(false);
        return;
     }
  };




    
  const submitHandler = async () => {

    setPicLoading(true);

    // checking if all the fields have values

    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    // checking if passwords match

    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

 //   console.log(name, email, password, pic);

    // we make an api request to store this into our DB

    try {

      // setting headers

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };


      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      //console.log(data);
      
      // giving a success msg 

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);


      // if user has successfully signed up we take to chat page
      history.push("/chats");

    } 
    
    catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };












    return <VStack spacing = "5px" color= "white"> {/* VStack is also a thing from chakraUI */}

    <FormControl id = "first-name" isRequired >
        <FormLabel fontFamily="Work sans">Name</FormLabel>
        <Input
            borderColor= "white"
            placeholder='Enter Your Name'
             onChange= { (e) => setName(e.target.value)}
        >
        
        </Input>
    </FormControl>
    

    
    <FormControl id = "email" isRequired>
        <FormLabel fontFamily="Work sans">Email</FormLabel>
        <Input
            borderColor= "white"
            placeholder='Enter Your Email'
             onChange= { (e) => setEmail(e.target.value)}
        >
        
        </Input>
    </FormControl>



    
    <FormControl id = "password" isRequired>
        <FormLabel fontFamily="Work sans">Password</FormLabel>

        <InputGroup>
        <Input
            type = {show ? "text" : "password"}    // if show is true, display it as text or as password 
            borderColor= "white"
            placeholder='Enter Your Password'
             onChange= { (e) => setPassword(e.target.value)}
        >
        </Input>
        <InputRightElement width= "4.5rem">
            <Button h = "1.9 rem" size = "xs" color= "black" fontFamily= "Work sans" onClick= {handleClick} > 
            {/* handleClick function changes the value of show state   */}
                {
                    show ? "Hide" : "Show" // if show is true, then hide, or show
                }
            </Button>

        </InputRightElement>    


        </InputGroup>
    </FormControl>


    
    <FormControl id = "confirmpassword" isRequired>
        <FormLabel fontFamily="Work sans">Confirm Password</FormLabel>

        <InputGroup>
        <Input
            type = {show ? "text" : "password"}    // if show is true, display it as text or as password 
            borderColor= "white"
            placeholder='Re-enter Your Password'
             onChange= { (e) => setConfirmpassword(e.target.value)}
        >
        </Input>
        <InputRightElement width= "4.5rem">
            <Button h = "1.9 rem" size = "xs" color= "black" fontFamily= "Work sans" onClick= {handleClick} > 
            {/* handleClick function changes the value of show state   */}
                {
                    show ? "Hide" : "Show" // if show is true, then hide, or show
                }
            </Button>

        </InputRightElement>    


        </InputGroup>
    </FormControl>




    <FormControl id = "pic">

        <FormLabel font-fontFamily="Work sans">Upload your picture</FormLabel>

       <Input
       type = "file" 
       p = {1.5}
       accept = "image/*"
       onChange={ (e) => postDetails(e.target.files[0])} />

    </FormControl>

    <Button
        colorScheme = "blue"
        width = "100%"
        style = {{ marginTop: 15 }} 
        onClick = {submitHandler} 
        isLoading={picLoading}
        > 

    Sign Up </Button>


  </VStack>;
  
};

export default Signup