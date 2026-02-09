"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BASE_URL_WITH_API } from '../../utils/config';

export default function SadadPayment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  console.log('SADAD Payment component rendered, orderId:', orderId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('SADAD useEffect running, orderId:', orderId);
    if (!orderId) {
      console.log('No orderId, setting error');
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    console.log('Fetching SADAD data for orderId:', orderId);
    // Fetch SADAD data
    axios.post(`${API_BASE_URL_WITH_API}/payments/sadad/init`, { order_id: orderId })
      .then(response => {
        console.log('SADAD init response:', response.data);
        setSadadData(response.data);
        setLoading(false);
        
        // Load SADAD script after data is loaded
        setTimeout(() => {
          if (!document.getElementById("sadad-sdk")) {
            console.log('Loading SADAD script');
            const script = document.createElement("script");
            script.id = "sadad-sdk";
            script.src = "https://sadadqa.com/jslib/sadad.js";
            script.onload = () => {
              console.log('SADAD script loaded, defining checksum function');
              // Define the global checksum function after script loads
              window.sadadGetChecksum = function () {
                console.log('sadadGetChecksum called');
                const form = document.getElementById("sadadFinalForm");
                if (!form) {
                  console.error('SADAD form not found');
                  return;
                }
                const formData = new FormData(form);
                console.log('Form data:', Object.fromEntries(formData));
                fetch(`${API_BASE_URL_WITH_API}/payments/sadad/checksum`, {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
                  body: new URLSearchParams(formData)
                })
                  .then(r => {
                    console.log('Checksum response status:', r.status);
                    return r.text();
                  })
                  .then(html => {
                    console.log('Received HTML response, length:', html.length);
                    // Replace the body with the HTML and submit the form
                    document.body.innerHTML = html;
                    const finalForm = document.getElementById("sadadFinalForm");
                    if (finalForm) {
                      console.log('Submitting final form');
                      finalForm.submit();
                    } else {
                      console.error('Final form not found in response');
                    }
                  })
                  .catch(err => console.error('Checksum error:', err));
              };
            };
            document.head.appendChild(script);
          }
        }, 1000);
      })
      .catch(err => {
        console.error('Error fetching SADAD data:', err);
        setError('Failed to load payment data');
        setLoading(false);
      });
  }, [orderId]);

  useEffect(() => {
    if (sadadData) {
      console.log('SADAD data loaded:', sadadData);
    }
  }, [sadadData]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading payment interface...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Error</h4>
          <p>{error}</p>
          <a href="/checkout" className="btn btn-primary">Back to Checkout</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Complete Your Payment</h3>
            </div>
            <div className="card-body">
              <form id="sadadFinalForm">
                {sadadData && (
                  <>
                    <input type="hidden" name="merchant_id" value={sadadData.merchant_id} />
                    <input type="hidden" name="ORDER_ID" value={sadadData.order_id} />
                    <input type="hidden" name="TXN_AMOUNT" value={sadadData.amount} />
                    <input type="hidden" name="WEBSITE" value={sadadData.website} />
                    <input type="hidden" name="CALLBACK_URL" value={sadadData.callback} />
                    <input type="hidden" name="txnDate" value={sadadData.txnDate} />
                    <input type="hidden" name="VERSION" value={sadadData.version} />
                  </>
                )}
              </form>

              <div id="sadad_cc_container"
                   data-i-color="#531232"
                   data-cbfunc="sadadGetChecksum"
                   style={{ minHeight: '400px', border: '1px solid #ddd', padding: '20px' }}>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}