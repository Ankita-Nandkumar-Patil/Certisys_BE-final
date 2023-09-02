import React from "react";
import logo from "../components/assets/logo.png";
import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";



export default function Verify() {
  



  return (
    <body class="bg-dark bg-graient">
      <div class="container text-white">
        <main>
          <div class="py-5 text-center">
            <img
              class="d-block mx-auto mb-4"
              // src="https://cdn.iconscout.com/icon/premium/png-256-thumb/copy-2801175-2321585.png"
              src={logo}
              alt=""
              width="72"
              height="57"
            />
            <h2>Verification</h2>
            <br />
            <p class="lead">Easy Verification of Your Documents.</p>
          </div>

          {/* <div class="mx-auto">
            <div class="col-md-5  col-lg-4 order-md-last">
              <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-primary">Verify </span>
              </h4>
              
              <ul class="list-group mb-3">
                <li class="list-group-item p-4 d-flex justify-content-between lh-sm">
                  <div>
                    <h6 class="my-0 ">Enter Hash</h6>
                    <small class="text-muted">Enter hash Below to verify</small>
                  </div>
                </li>
              </ul>

              <form class="card p-5">
                <div class="input-group">
                

                  <input
                    id="hash"
                    type="text"
                    placeholder="Hash"
                    onChange={ipevent}
                    value={hash.hash}
                  />

                  <a
                    href={`https://skywalker.infura-ipfs.io/ipfs/${hash.hash}`}
                    target="_blank"
                  >
                    <button
                      type="submit"
                      class="btn btn-primary"
                      fdprocessedid="9g9kvk"
                    >
                      Verify
                    </button>
                  </a>
                </div>
              </form>
            </div>
          </div> */}

          
          <div class="row featurette pt-5 mt-5  bg2">
        <div class="col-md-7">
          <h2 class="featurette-heading fw-normal lh-1 head">Certificate Verifier</h2>
          <p class="lead pt-5 ">
            Enter hash of the document in below textbox. <br />
            It will show the original document stored at this address.<br/>
            So it'll be easy to verify document at just one click..!
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
                        {/* <h5 className="head pb-4">Select File</h5> */}
                        <form onSubmit={onSubmitHandler}>
                          {/* <input id="file-upload" type="file" name="file" /> */}
                          <div className="justify-content-center">
                            {/* <button
                              className="btn btn-outline-light me-2 btn-lg mt-5 text-dark"
                              type="submit"
                            >
                              Upload file
                            </button> */}
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
                              "https://ipfs.io/ipfs/" +
                              image.path
                            }
                          >
                            <h3>
                              {"ipfs.io/ipfs/" +
                                image.path}
                            </h3>
                          </a> */}
                          
                          {/* <h5>hash = </h5>
                        <h6 id="baseurl">{image.path}</h6> */}
                        </>
                      ))}
                    </div>

                    <div>
                      <form className="form1 pt-2 pb-4">
                        Enter hash :{"  "}
                        <input
                          id="hash"
                          type="text"
                          onChange={ipevent}
                          value={hash.hash}
                        />
                      </form>
                      <a
                        href={`https://io/ipfs/${hash.hash}`}
                        target="_blank"
                      >
                        <div className="justify-content-center">
                        <button className="btn btn-primary">Verify</button>
                        </div>
                      </a>

                      
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

      <script
        src="/docs/5.3/dist/js/bootstrap.bundle.min.js"
        crossorigin="anonymous"
      ></script>

      <script src="checkout.js"></script>
    </body>
  );
}
