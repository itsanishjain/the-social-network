import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import SocialNetworkABI from "../../SocailNetwork.json";
import { hasEthereum, requestAccount, nftDotStorage } from "../../utils";
import toast from "./Toast";

export default function InputForm() {
  const [loading, setLoading] = useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [formValues, setFormValues] = useState({
    imageUrl: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = (_formValues) => {
    const errors = {};
    if (!_formValues.imageUrl) {
      errors.companyName = "please upload an image";
    }
    return errors;
  };
  // create a function which set the values of form field
  const handleOnChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFileInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e, obj) => {
    e.preventDefault();
    let _errors = validateForm(formValues);
    setFormErrors(_errors);
    if (Object.keys(_errors).length === 0) {
      console.log("NOOOOO ERRORS");
      console.log(formValues.imageUrl);
      setLoading(true);
      nftDotStorage(formValues.imageUrl).then((contentId) => {
        // console.log("CONTENT ID", contentId);
        createPost(contentId);

      });
      console.log("FORM SUBMITED SUCCESSFULLY");
    }
  };

  // create a post
  async function createPost(_imageUrl) {
    if (!hasEthereum()) {
      notify("warning", "MetaMask unavailable");
      return;
    }
    
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_SOCIALNETWORK_ADDRESS,
      SocialNetworkABI,
      signer
    );

    const transaction = await contract.addPost(_imageUrl);
    await transaction.wait();
    setLoading(false);
    console.log("POST CREATED SUCCESSFULLY");
  }

  return (
    <form>
      {formErrors.companyName && (
        <span className="error">{formErrors.companyName}</span>
      )}
      <label>
        Image*
        <input
          type="file"
          name={Object.keys(formValues)[0]}
          onChange={handleFileInput}
        ></input>
      </label>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <button onClick={(e) => handleSubmit(e, formValues)}>
          Create your Post
        </button>
      )}
    </form>
  );
}
