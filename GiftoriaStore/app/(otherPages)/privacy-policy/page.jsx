"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <>
      <Header10 />
      <>
        {/* page-title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </div>
          </div>
        </div>
        {/* /page-title */}
        {/* main-page */}
        <section className="flat-spacing-25">
          <div className="container">
            <div className="tf-main-area-page">
              {isArabic ? (
                <>
                  <h4>سياسة الشركة الخاصة المحدودة</h4>
                  <p>
                    تعترف شركة الشركة الخاصة المحدودة وكل من الشركات التابعة والأم والمنتسبة لها والتي تعتبر مشغلة لهذا الموقع ("نحن" أو "لنا") بأنك تهتم بكيفية استخدام ومشاركة المعلومات الخاصة بك. لقد أنشأنا سياسة الخصوصية هذه لإعلامك بالمعلومات التي نجمعها على الموقع، وكيف نستخدم معلوماتك والخيارات المتاحة لك حول طريقة جمع واستخدام معلوماتك. يرجى قراءة سياسة الخصوصية هذه بعناية. يشير استخدامك للموقع إلى أنك قد قرأت وقبلت ممارسات الخصوصية الخاصة بنا، كما هو موضح في سياسة الخصوصية هذه.
                  </p>
                  <p>
                    يرجى العلم أن الممارسات الموضحة في سياسة الخصوصية هذه تنطبق على المعلومات التي نجمعها أو الشركات التابعة أو المنتسبة أو الوكلاء: (أولاً) من خلال هذا الموقع، (ثانياً) عند الاقتضاء، من خلال قسم خدمة العملاء بخصوص هذا الموقع، (ثالثاً) من خلال المعلومات المقدمة لنا في متاجر التجزئة المستقلة، (رابعاً) من خلال المعلومات المقدمة لنا بالتزامن مع العروض الترويجية والمسابقات.
                  </p>
                  <p>
                    نحن غير مسؤولين عن المحتوى أو ممارسات الخصوصية في أي مواقع ويب أخرى.
                  </p>
                  <p>
                    نحتفظ بالحق، وفقاً لتقديرنا الوحيد، في تعديل أو تحديث أو إضافة أو إيقاف أو إزالة أو تغيير أي جزء من سياسة الخصوصية هذه، كلياً أو جزئياً، في أي وقت. عندما نعدل سياسة الخصوصية هذه، سنراجع تاريخ "آخر تحديث" الموجود في أعلى سياسة الخصوصية هذه.
                  </p>
                  <p>
                    إذا قدمت معلومات لنا أو وصلت أو استخدمت الموقع بأي طريقة بعد تغيير سياسة الخصوصية هذه، فستعتبر قد وافقت بشكل غير مشروط وموافق على هذه التغييرات. ستكون النسخة الحالية من سياسة الخصوصية هذه متاحة على الموقع وستحل محل جميع النسخ السابقة من سياسة الخصوصية هذه.
                  </p>
                  <p>
                    إذا كان لديك أي أسئلة بشأن سياسة الخصوصية هذه، يجب عليك الاتصال بقسم خدمة العملاء عبر البريد الإلكتروني على marketing@company.com
                  </p>
                </>
              ) : (
                <>
                  <h4>The Company Private Limited Policy</h4>
                  <p>
                    The Company Private Limited and each of their respective
                    subsidiary, parent and affiliated companies is deemed to operate
                    this Website (“we” or “us”) recognizes that you care how
                    information about you is used and shared. We have created this
                    Privacy Policy to inform you what information we collect on the
                    Website, how we use your information and the choices you have
                    about the way your information is collected and used. Please
                    read this Privacy Policy carefully. Your use of the Website
                    indicates that you have read and accepted our privacy practices,
                    as outlined in this Privacy Policy.
                  </p>
                  <p>
                    Please be advised that the practices described in this Privacy
                    Policy apply to information gathered by us or our subsidiaries,
                    affiliates or agents: (i) through this Website, (ii) where
                    applicable, through our Customer Service Department in
                    connection with this Website, (iii) through information provided
                    to us in our free standing retail stores, and (iv) through
                    information provided to us in conjunction with marketing
                    promotions and sweepstakes.
                  </p>
                  <p>
                    We are not responsible for the content or privacy practices on
                    any websites.
                  </p>
                  <p>
                    We reserve the right, in our sole discretion, to modify, update,
                    add to, discontinue, remove or otherwise change any portion of
                    this Privacy Policy, in whole or in part, at any time. When we
                    amend this Privacy Policy, we will revise the “last updated”
                    date located at the top of this Privacy Policy.
                  </p>
                  <p>
                    If you provide information to us or access or use the Website in
                    any way after this Privacy Policy has been changed, you will be
                    deemed to have unconditionally consented and agreed to such
                    changes. The most current version of this Privacy Policy will be
                    available on the Website and will supersede all previous
                    versions of this Privacy Policy.
                  </p>
                  <p>
                    If you have any questions regarding this Privacy Policy, you
                    should contact our Customer Service Department by email at
                    marketing@company.com
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </>

      <Footer1 />
    </>
  );
}
