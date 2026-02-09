"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BASE_URL_WITH_API } from '../../utils/config';

export default function SadadPayment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [sadadData, setSadadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    // Load jQuery and SADAD script
    if (!document.getElementById("jquery")) {
      const jqueryScript = document.createElement("script");
      jqueryScript.id = "jquery";
      jqueryScript.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      document.head.appendChild(jqueryScript);
    }

    if (!document.getElementById("sadad-sdk")) {
      document.head.insertAdjacentHTML('beforeend', '<script id="sadad-sdk" src="https://sadadqa.com/jslib/sadad.js"></script>');
    }

    // Fetch SADAD data
    axios.post(`${API_BASE_URL_WITH_API}/payments/sadad/init`, { order_id: orderId })
      .then(response => {
        setSadadData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching SADAD data:', err);
        setError('Failed to load payment data');
        setLoading(false);
      });
  }, [orderId]);

  useEffect(() => {
    if (sadadData) {
      // Define the global checksum function as per SADAD documentation
      window.sadadGetChecksum = function () {
        $.ajax({
          type: "POST",
          url: `${API_BASE_URL_WITH_API}/payments/sadad/checksum`,
          data: $('#sadadFinalForm').serialize(),
          success: function (response) {
            window.afterChecksumSubmit(response);
          }
        });
      };

      // Define afterChecksumSubmit to handle the HTML response
      window.afterChecksumSubmit = function (html) {
        // Replace the body with the HTML and submit the form
        document.body.innerHTML = html;
        document.getElementById("sadadFinalForm").submit();
      };
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
              {sadadData && (
                <>
                  <form id="sadadFinalForm">
                    <input type="hidden" name="merchant_id" value={sadadData.merchant_id} />
                    <input type="hidden" name="ORDER_ID" value={sadadData.order_id} />
                    <input type="hidden" name="TXN_AMOUNT" value={sadadData.amount} />
                    <input type="hidden" name="WEBSITE" value={sadadData.website} />
                    <input type="hidden" name="CALLBACK_URL" value={sadadData.callback} />
                    <input type="hidden" name="txnDate" value={sadadData.txnDate} />
                    <input type="hidden" name="VERSION" value={sadadData.version} />
                  </form>

                  <div id="sadad_cc_container"
                       data-i-color="#531232"
                       data-cbfunc="sadadGetChecksum">
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}