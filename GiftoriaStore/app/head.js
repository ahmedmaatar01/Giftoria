export default function Head() {
  return (
    <>
      <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.sadadGetChecksum = window.sadadGetChecksum || function(){
  console.warn('SADAD checksum callback not ready');
};`
        }}
      />
      <script src="https://sadadqa.com/jslib/sadad.js"></script>
    </>
  );
}
