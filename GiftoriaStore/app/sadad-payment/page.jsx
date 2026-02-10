"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BASE_URL_WITH_API } from '../../utils/config';
import Script from 'next/script';

export default function SadadPayment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  console.log(orderId)

  console.log('SADAD Payment component rendered, orderId:', orderId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sadadData, setSadadData] = useState(null);

  useEffect(() => {
    console.log('SADAD useEffect running, orderId:', orderId);
    if (!orderId) {
      console.log('No orderId, setting error');
      setError('Order ID is missing');
      setLoading(false);
      return;
    }
    window.afterChecksumSubmit = function (html) {
      const container = document.getElementById("sadad_cc_container");
      if (!container) return;
      container.innerHTML = html;
    };

    console.log('Fetching SADAD data for orderId:', orderId);
    // Fetch SADAD data

    axios.post(`${API_BASE_URL_WITH_API}/payments/sadad/init`, { order_id: orderId })
      .then(response => {
        console.log('SADAD init response:', response.data);
        setSadadData(response.data);
        setLoading(false);

        // Define the global checksum function after data is loaded
        window.sadadGetChecksum = function () {
          fetch(`${API_BASE_URL_WITH_API}/payments/sadad/checksum`, {
            method: "POST",
            body: new URLSearchParams(
              new FormData(document.getElementById("sadadFinalForm"))
            ),
            credentials: "include",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
            .then(res => res.text())
            .then(html => {
              // THIS is what SADAD expects
              window.afterChecksumSubmit(html);
            })
            .catch(console.error);
        };

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
    <>
      <Script src="https://sadadqa.com/jslib/sadad.js" strategy="afterInteractive" />
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
    </>
  );
}