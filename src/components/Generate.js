import { useState, useEffect } from "react";
import Web3 from "web3";
// import temp from '../components/assets/temp3.png';
import SimpleStorage from "../contracts/SimpleStorage.json";

import temp from "../components/assets/temp3.png";
import "./Style.css";
// import { toPng } from "html-to-image";
// import download from "downloadjs";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import jsPDF, { jspdf } from "jspdf";

// ********************* To upload on ipfs***********************
import { create as ipfsHttpClient } from "ipfs-http-client";
import $ from "jquery";

// ************************* TO SEND EMAIL ****************************
import emailjs, { send } from "emailjs-com";

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);

// import { useNavigate } from "react-router-dom";

// const Generate = () => {
// const [user, setUser] = useState({
//   fname : "",org: "", email: "", cert: "",idate:"", vdate:""
// })

// let name, value ;

// const handleIp=(e) =>{
//   console.log(e);
//   name = e.target.name;
//   value = e.target.value;

//   setUser({...user, [name]:value});
// }

function Generate() {
  //newly added code starts***********************************************************************************************
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [data, setData] = useState(null);
  useEffect(() => {
    async function init() {
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      //console.log(web3);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      console.log("Contract Address:", deployedNetwork.address);
      const contract = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork.address
      );
      //console.log(contract);
      setState({ web3: web3, contract: contract });
    }
    init();
  }, []);

  useEffect(() => {
    {
      const { contract } = state;
      async function read() {
        const dataValue = await contract.methods.getter().call();
        setData(dataValue);
        // console.log(data);
      }
      contract && read();
    }
  }, [state, state.contract]);

  async function updateValue() {
    const { contract } = state;
    const input = document.querySelector("#fname");
    await contract.methods
      .setter(input.value)
      .send({ from: "0xdB31BAE16044c100bAA5e470424BbF2BeEC4a919" }); //ganache or metamask acc address ##############################################################################################
    const dataValue = await contract.methods.getter().call();
    setData(dataValue);
  }
  //newly added code ends*****************************************************************

  const [name, setvalue] = useState({
    fname: "",
    email: "",
    idate: "",
    vdate: "",
    cert: "",
    org: "",
    authName: "",
    auth: "",
    authName2: "",
    auth2: "",
    logo: "",
    hashId: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Certificate is being generated.!");
  };
  let type, value;
  const ipEvent = (event) => {
    console.log(event.target.value);
    value = event.target.value;
    type = event.target.name;

    setvalue({ ...name, [type]: value });
  };

  // certificate download function
  // const handleCaptureClick = async () => {
  // const certificate = document.querySelector < HTMLElement > ".image-wrapper";
  // if (!certificate) return;
  // const canvas = await html2canvas(certificate);
  // const dataURL = canvas.toDataURL("image/png");
  // downloadjs(dataURL, "download.png", "image/png");
  // console.log("done");

  const downloadDoc = async () => {
    const input = document.getElementById("image-download");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      // pdf.addImage(imgData, "JPEG", 50, 50);
      pdf.addImage(imgData, "JPEG", 10, 50, 580, 500);
      pdf.save(`${"certificate"}`);
    });
  };

  const downloadDoc2 = async () => {
    const input = document.getElementById("image-download2");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      // pdf.addImage(imgData, "JPEG", 50, 50);
      pdf.addImage(imgData, "JPEG", 10, 50, 580, 500);
      pdf.save(`${"certificate"}`);
    });
  };
  // };

  // const node = document.getElementById("image-download")

  // function downloadImage(){
  //   toPng(node)
  //     .then(dataURL =>{
  //       download(dataURL, "certificate.png")
  //     })
  //     .catch(()=> console.log("Error"))
  // }

  //   render() {

  // ******************************************To upload to ipfs ******************************************************************************

  const [uploadedImages, setUploadedImages] = useState([]);
  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form[0].files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];
    // upload files
    const result = await ipfs.add(file);

    setUploadedImages([
      ...uploadedImages,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);

    form.reset();
  };

  const [hash, sethash] = useState({
    hash: " ",
  });

  const ipevent = (e) => {
    let value;
    console.log(e.target.value);
    value = e.target.value;
    sethash({ hash: value });
  };

  // ************************* IPFS upload ends ****************************************************

  // ************************* to send Email ****************************************************

  // const sendEmail= (e) =>{
  //   e.preventDefault();

  //   emailjs.send('gmail', 'template_fi7d17g', {
  //     url: `https://skywalker.infura-ipfs.io/ipfs/${hash.hash}`,
  //     // cert_id: certid,
  //     send_to: `${name.email}`,
  //   }, 'MoCtvcDTDUYGW9Dxh')

  //     .then((result) => {
  //         alert("Email has been sent to recipent!", result.text);
  //     }, (error) => {
  //       alert("Error, try again!", error.text);
  //     });
  //     e.target.reset();
  // }

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_tuszqbb", "template_fi7d17g", e.target, "lso7ic1XhWozr3kB6")
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  };
  // ************************* send Email ends ****************************************************

  return (
    // <html>

    <body class="bg-dark bg-graient myHome">
      {/* Form generation */}
      <div class="container text-white">
        <main>
          <div class="py-5 text-center">
            <img
              class="d-block mx-auto mb-4"
              src="https://cdn.iconscout.com/icon/premium/png-256-thumb/copy-2801175-2321585.png"
              alt=""
              width="72"
              height="57"
            />
            <h2>Certification form</h2>
            <br />
            <p class="lead">Fill all the details mentioned below precisely</p>
          </div>

          <div class="row g-5 ">
            <div class="col-md-7 col-lg-8">
              <h4 class="mb-3">Student/Applicant Details :</h4>
              <form
                class="needs-validation"
                onSubmit={handleSubmit}
                novalidate=""
              >
                <div class="row g-3">
                  <div class="col-sm-6">
                    <label for="username" class="form-label">
                      First Name
                    </label>
                    <div class="input-group has-validation">
                      <input
                        type="text"
                        class="form-control"
                        id="username"
                        placeholder="First Name"
                        required=""
                        fdprocessedid="5t1jeq"
                        autoComplete="off"
                      />
                      <div class="invalid-feedback">Your name is required.</div>
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <label for="username" class="form-label">
                      Last Name
                    </label>
                    <div class="input-group has-validation">
                      {/* <span class="input-group-text">@</span> */}
                      <input
                        type="text"
                        class="form-control"
                        id="username"
                        autoComplete="off"
                        placeholder="Last Name"
                        required=""
                        fdprocessedid="5t1jeq"
                      />
                      <div class="invalid-feedback">Your name is required.</div>
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="org" class="form-label">
                      Certifying Organization
                    </label>
                    <div class="input-group has-validation">
                      {/* <span class="input-group-text">@</span> */}
                      <input
                        type="text"
                        class="form-control"
                        id="org"
                        // defaultValue={user.org}
                        onChange={ipEvent}
                        placeholder="Org. Name"
                        autoComplete="off"
                        name="org"
                        required=""
                        fdprocessedid="5t1jeq"
                        value={name.org}
                      />
                      <div class="invalid-feedback">
                        Your username is required.
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="email" class="form-label">
                      Applicant's Email{" "}
                      <span class="text-muted">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      // defaultValue={user.email}
                      onChange={ipEvent}
                      placeholder="you@example.com"
                      autoComplete="off"
                      name="email"
                      value={name.email}
                      fdprocessedid="2f8cgm"
                    />
                    <div class="invalid-feedback">
                      Please enter a valid email address.
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="cert" class="form-label">
                      Certified for
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="cert"
                      // defaultValue={user.cert}
                      // onChange = {handleIp}
                      onChange={ipEvent}
                      // name = "cert"
                      placeholder="exam/competition name"
                      name="cert"
                      autoComplete="off"
                      value={name.cert}
                      required=""
                      fdprocessedid="55rzg6"
                    />
                    <div class="invalid-feedback">Please enter.</div>
                  </div>

                  <div class="col-sm-6">
                    <label for="auth" class="form-label">
                      Certifying Authority
                    </label>
                    <div class="input-group has-validation">
                      <input
                        type="text"
                        name="auth"
                        class="form-control"
                        id="auth"
                        autoComplete="off"
                        onChange={ipEvent}
                        value={name.auth}
                        placeholder="HOD, Dean etc."
                        required=""
                        // fdprocessedid="5t1jeq"
                      />
                      <div class="invalid-feedback">Your name is required.</div>
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <label for="authName" class="form-label">
                      Authority Name
                    </label>
                    <div class="input-group has-validation">
                      {/* <span class="input-group-text">@</span> */}
                      <input
                        type="text"
                        name="authName"
                        class="form-control"
                        autoComplete="off"
                        id="authName"
                        onChange={ipEvent}
                        value={name.authName}
                        placeholder="Authority Name"
                        required=""
                        // fdprocessedid="5t1jeq"
                      />
                      <div class="invalid-feedback">Your name is required.</div>
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <label for="auth2" class="form-label">
                      Certifying Authority 2
                    </label>
                    <div class="input-group has-validation">
                      <input
                        type="text"
                        class="form-control"
                        id="auth2"
                        onChange={ipEvent}
                        name="auth2"
                        autoComplete="off"
                        value={name.auth2}
                        placeholder="HOD, Dean etc."
                        required=""
                        fdprocessedid="5t1jeq"
                      />
                      <div class="invalid-feedback">Your name is required.</div>
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <label for="authName2" class="form-label">
                      Authority Name
                    </label>
                    <div class="input-group has-validation">
                      {/* <span class="input-group-text">@</span> */}
                      <input
                        type="text"
                        class="form-control"
                        id="authName2"
                        name="authName2"
                        onChange={ipEvent}
                        value={name.authName2}
                        placeholder="Authority Name"
                        required=""
                        autoComplete="off"
                        fdprocessedid="5t1jeq"
                      />
                      <div class="invalid-feedback">Your name is required.</div>
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="idate" class="form-label">
                      Issue Date<span class="text-muted">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      class="form-control"
                      id="idate"
                      // defaultValue={user.idate}
                      onChange={ipEvent}
                      value={name.idate}
                      autoComplete="off"
                      placeholder="Issued on"
                      name="idate"
                      fdprocessedid="olf1w5"
                    />
                  </div>

                  <div class="col-12">
                    <label for="logo" class="form-label">
                      Logo<span class="text-muted">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      class="form-control"
                      id="logo"
                      // defaultValue={user.idate}
                      onChange={ipEvent}
                      autoComplete="off"
                      value={name.logo}
                      placeholder="Place your logo url"
                      name="logo"
                      fdprocessedid="olf1w5"
                    />
                  </div>
                </div>

                <hr class="my-4" />

                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="same-address"
                    required=""
                  />
                  <label class="form-check-label" for="same-address">
                    All the details are CORRECT
                  </label>
                </div>
                <hr class="my-4" />

                <div class="col-12">
                  <label for="fname" class="form-label">
                    Name on Certificate
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="fname"
                    // defaultValue={user.fname}
                    onChange={ipEvent}
                    value={name.fname}
                    placeholder="Name to be displayed"
                    name="fname"
                    required=""
                    autoComplete="off"
                    fdprocessedid="55rzg6"
                  />
                  <div class="invalid-feedback">
                    Name Confirmation is required.
                  </div>
                </div>

                <hr class="my-4" />

                <button
                  class="w-100 btn btn-primary btn-lg"
                  type="submit"
                  fdprocessedid="euovw"
                  id="submitBtn"
                  // onClick={this.handleSubmit}
                >
                  Submit{" "}
                </button>
                {/* <View state={{fname, idate,}} /> */}
                <br />
                <br />
              </form>

              {/* newly added code starts  */}

              <div> This is my name : {data}</div>
              <button onClick={updateValue}>Click Here To Change Value</button>

              {/* newly added code ends  */}
            </div>
          </div>
        </main>

        <footer class="my-5 pt-5 text-muted text-center text-small">
          <p class="mb-1">© 2017–2022 Company Name</p>
          <ul class="list-inline">
            <li class="list-inline-item">
              <a href="#">Privacy</a>
            </li>
            <li class="list-inline-item">
              <a href="#">Terms</a>
            </li>
            <li class="list-inline-item">
              <a href="#">Support</a>
            </li>
          </ul>
        </footer>
      </div>

      {/* print Certificate************************************************************************************************************* */}

      <div class=" container1">
        <div className="image-wrapper" id="image-download">
          <img src={temp} className="image" />
          <h1 className="fname">{name.fname}</h1>
          <h6 className="org">{name.cert}</h6>
          <h5 className="auth">{name.auth}</h5>
          <h5 className="authName">{name.authName}</h5>
          <h5 className="auth2">{name.auth2}</h5>
          <h5 className="authName2">{name.authName2}</h5>
          <h6 className="idate">{name.idate}</h6>
          <img className="logo" src={name.logo} />
        </div>
      </div>

      {/* <div class="col d-flex justify-content-center button1"> */}
      <div className="col d-flex justify-content-center pb-5">
        <div className="px-2">
          <button
            type="button"
            onClick={downloadDoc}
            class="btn btn-outline-light  btn-lg"
          >
            Download{" "}
          </button>{" "}
        </div>
      </div>

      <div className="pb-5"></div>

      {/* ******************************************To upload to ipfs ******************************************************************************  */}
      {/* ***************************************** WITHOUT CSS WORKING CODE STARTS**************************** */}

      {/* <div className="app">
      <div className="app__container">
        {ipfs ? (
          <div className="container">
            <h1>IPFS uploader</h1>
            <form onSubmit={onSubmitHandler}>
              <label for="file-upload" class="custom-file-upload">
                Select File
              </label>
              <input id="file-upload" type="file" name="file" />
              <button className="button" type="submit">
                Upload file
              </button>
            </form>
          </div>
        ) : null}
        <div className="data">
          {uploadedImages.map((image, index) => (
            <>
              <img
                className="image"
                alt={`Uploaded #${index + 1}`}
                src={"https://skywalker.infura-ipfs.io/ipfs/" + image.path}
                style={{ maxWidth: "400px", margin: "15px" }}
                key={image.cid.toString() + index}
              />
              <h4>Link to IPFS:</h4>
              <a href={"https://skywalker.infura-ipfs.io/ipfs/" + image.path}>
                <h3>{"https://skywalker.infura-ipfs.io/ipfs/" + image.path}</h3>
              </a>
            </>
          ))}
        </div>


        <div>
          <form>
            Enter hash :{" "}
            <input id="hash" type="text" onChange={ipevent} value={hash.hash} />
          </form>
          <a
            href={`https://skywalker.infura-ipfs.io/ipfs/${hash.hash}`}
            target="_blank"
          >
            <button>Verify</button>
          </a>
          {/* $(function(){" "}
          {$("#baseUrl").click(function () {
            window.location = $(this).attr("href") + "/" + $("#hash").val();
            return false;
          })}
          ); 
          <h1>hash = </h1>
          <h2 id="baseurl">{hash.hash}</h2>
        </div>
      </div>
    </div> 
    {/* *********************************************WITHOUT CSS WORKING CODE ENDS******************************* */}

      {/* *********************************************WITH CSS WORKING CODE STARTS******************************* */}

      <div class="row featurette pt-5 mt-5  bg2">
        <div class="col-md-7">
          <h2 class="featurette-heading fw-normal lh-1 head">IPFS UPLOADER</h2>
          <p class="lead pt-5 mr-2 ">
            Download the above generated certificate and upload it to IPFS. IPFS
            will return a unique hash below. <br />
            Generate the certificate with that hash and send it to your
            students.!
          </p>
        </div>
        <div class="col-md-5 py-2 rounded bg1">
          <div class="mx-auto">
            <div class="   order-md-last">
              <div class="input-group bg3 rounded py-3 px-3">
                <div className="app">
                  <div className="app__container">
                    {ipfs ? (
                      <div className="container mx-2 px-3 py-3">
                        <h5 className="head pb-4">Select File</h5>
                        <form onSubmit={onSubmitHandler}>
                          <input id="file-upload" type="file" name="file" />
                          <div className="justify-content-center">
                            <button
                              className="btn btn-outline-light me-2 btn-lg mt-5 text-dark"
                              type="submit"
                            >
                              Upload file
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : null}
                    <div className="data">
                      {uploadedImages.map((image, index) => (
                        <>
                          <img
                            className="image"
                            alt={`Uploaded #${index + 1}`}
                            src={
                              "https://skywalker.infura-ipfs.io/ipfs/" +
                              image.path
                            }
                            style={{ maxWidth: "400px", margin: "15px" }}
                            key={image.cid.toString() + index}
                          />
                          {/* <h4>Link to IPFS:</h4>
                          <a
                            href={
                              "https://skywalker.infura-ipfs.io/ipfs/" +
                              image.path
                            }
                          >
                            <h3>
                              {"https://skywalker.infura-ipfs.io/ipfs/" +
                                image.path}
                            </h3>
                          </a> */}

                          <h5>hash = </h5>
                          <h6 id="baseurl">{image.path}</h6>
                        </>
                      ))}
                    </div>

                    <div>
                      <form className="form1 pt-3">
                        Enter hash :{" "}
                        <input
                          id="hash"
                          type="text"
                          onChange={ipevent}
                          value={hash.hash}
                        />
                      </form>
                      {/* <a
                        href={`https://skywalker.infura-ipfs.io/ipfs/${hash.hash}`}
                        target="_blank"
                      >
                        <button>Verify</button>
                      </a> */}

                      {/* $(function(){" "}
          {$("#baseUrl").click(function () {
            window.location = $(this).attr("href") + "/" + $("#hash").val();
            return false;
          })}
          ); */}
                      {/* <h1>hash = </h1>
                      <h2 id="baseurl">{hash.hash}</h2> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* *********************************************WITH CSS WORKING CODE ENDS******************************* */}

      {/* ******************************** PRINT CERTIFICATE WITH HASH ************************************************************  */}

      <div class=" container1">
        <div className="image-wrapper" id="image-download2">
          <img src={temp} className="image" />
          <h1 className="fname">{name.fname}</h1>
          <h6 className="org">{name.cert}</h6>
          <h5 className="auth">{name.auth}</h5>
          <h5 className="authName">{name.authName}</h5>
          <h5 className="auth2">{name.auth2}</h5>
          <h5 className="authName2">{name.authName2}</h5>
          <h6 className="idate">{name.idate}</h6>
          <img className="logo" src={name.logo} />
          <h5 className="hashId">{hash.hash}</h5>
        </div>
      </div>

      {/* ************************************************to send Email***************************************** */}
      <div>
        <div className="container">
          <form onSubmit={sendEmail}>
            <div className="row pt-5 mx-auto">
              <div className="col-8 form-group mx-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  name="name"
                />
              </div>
              <div className="col-8 form-group pt-2 mx-auto">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  name="email"
                />
              </div>
              <div className="col-8 form-group pt-2 mx-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  name="subject"
                />
              </div>
              <div className="col-8 form-group pt-2 mx-auto">
                <textarea
                  className="form-control"
                  id=""
                  cols="30"
                  rows="8"
                  placeholder="Your message"
                  name="message"
                ></textarea>
              </div>
              <div className="col-8 pt-3 mx-auto">
                <input
                  type="submit"
                  className="btn btn-info"
                  value="Send Message"
                ></input>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="col d-flex justify-content-center pb-5">
        <div className="px-2">
          <button
            type="button"
            onClick={downloadDoc2}
            class="btn btn-outline-light  btn-lg"
          >
            Download with Hash{" "}
          </button>{" "}
        </div>
      </div>

      <div className="pb-5"></div>

      <script
        src="/docs/5.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
        crossorigin="anonymous"
      ></script>
      {/* <script src="index2.js"></script> */}
      <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>
      <script src="checkout.js"></script>
    </body>
  );
  //   }
}

export default Generate;
