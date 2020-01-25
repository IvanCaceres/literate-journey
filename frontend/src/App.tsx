import React, { useState, useEffect } from 'react';
import './App.css';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import axios from 'axios';
import Chart from "chart.js";

interface Values {
  deviceId: string;
  endTime?: number;
  windowTime?: number;
  numWindows?: number;
}

interface ApiParams {
  device_uuid: string;
  end_time?: number;
  window_time?: number;
  num_windows?: number;
}

interface Bandwidth {
  start: number,
  end: number,
  bytes_ts: number,
  bytes_fs: number,
}

interface BarOptions {
  label: string,
  backgroundColor: string,
  data: number[]
}

let uniqueKeys = ['cf4844bc-a107-4e0a-84e1-fa04d76d388c', 'd2c7cedc-0a76-4bda-9c0b-c20bb62e715a', '69639c99-dea4-4c2d-8bb2-412145fada65', '04827402-0725-437c-bc22-c9670ea084f0', 'c244613c-443b-4dbc-b278-747d982d6f84', 'bd2b4a7a-d1c4-4799-b690-f8a69a2c64ab', 'ba3e3493-866e-4ebd-ac71-0629f0fa0737', '4b96bc0b-ab45-45b7-b81b-2aecff075f9b', '0aa370cc-e6e4-4fdd-a401-bf9954137fa0', '6a2b00ef-ba03-49f6-9f6e-965a1219702d', 'e90b26f7-e545-4009-a8f2-71263498919b', '80c6371d-2d39-4bad-b7fc-0af3a5e1bbb0', '5dc7d49e-febf-431f-9f9c-47b73ba1d13f', '893adb80-2655-427a-bbe1-5e2ee6c65bca', '6bc53680-a246-48d9-bccf-2a1f3541df04', '61e6a605-74ce-4af9-9a65-8fd8e7f5679a', '9dec70ab-99ba-41ff-912d-8d3c6c76a3d2', 'b79e1e4c-674b-4bbb-a6ce-5f9fcb110afc', 'f2327d7b-6804-429e-80e6-3b93aa41acc3', 'd417190e-7413-4d8b-acc4-51f6924c43ec', 'a93c3983-58ce-4b65-a7b3-4c6260081e28', '41d07e7d-ad37-4eef-b407-252b2bab1868', 'd5a19a62-d3e1-4cce-b1c4-b52bad32b7ef', '5e67d6d9-3473-469f-a744-53e16a0260e5', 'd75c54d3-e672-4580-8bd1-b39ea9c66e93', '1cd09ca9-ee8c-4a38-ae7f-b6e4d422b4be', '6073da8a-22cb-450e-83a6-c665dfafff31', '25bb84c5-09d8-48ce-9833-40f25135c375', '8c253c1a-c21f-44da-85c4-9e22e2111d92', '4cc852b8-a3f4-4cd2-9a8a-0198a4ecd998', '46a195e7-2924-497e-af87-0cd3c03f1e61', '47dee7a1-0837-41d1-8fbb-2c2055d09f01', 'd884da0b-ce10-4ece-b258-28efdbaeca08', '85b40852-c8b2-4f8e-a30e-7a510ace465a', '786b2b79-047a-4f48-9224-f05cae59a453', '4e7d2fa7-2291-4dbc-8754-ffe121cb6f92', 'af5bee0a-d5e4-4ce1-82bf-f685da42c2c7', '6287768c-ea5a-4699-9dce-e0fbe1d4944c', '179048b2-ac01-4f6f-88a6-7c2c47cb1304', '8124b480-6e91-4f01-9c33-50c66e2e71a8', 'ff2647da-c553-43ed-a7ca-8567a4819ae1', '6a58ed21-2311-4149-b1b8-6fb82655cb14', 'adc967b4-192d-4b20-a3a5-a1e7397cd29c', '29b88f8c-14e0-4873-bfd1-40f49c5eb2d8', 'd416ff1b-0af7-4868-b038-38e691283dfa', '3ff2c859-5664-4d13-9e7f-4cb6f64ed281', '8ba3949e-cf4a-4f47-9097-4a81ea21dc32', 'd1e7bd57-40b6-409c-bc95-e1b7793b0e0d', '300911e1-09de-430e-ae27-68a9aa3cd9b5', '7c518334-2a43-4b82-9e92-d6e3049049d5', '4517f44a-726a-4a08-852a-9cf9f4706b51', 'e1feb958-210a-4e41-8c06-22d0ceaa3f9c', 'c8f14396-dfc2-4269-a098-6d998c1c287f', 'd81985f6-7371-4b1f-a4d8-428eae177d38', '6af4b6c0-845b-4f98-823c-fd6691d8d873', '3880e491-fbb6-46c8-905e-63160d1405c0', '35cc5dab-3d43-4e3b-aeab-78a87a92dcba', '48ffaf68-5ffe-4720-8366-d9385a3832be', 'f716f40f-ec5b-49c0-8e32-87088de1a982', '12efa4cd-af40-4d4f-8fac-92204551c3ae', '7f2e0c35-d720-4b9c-a016-60879fb4db8d', '6288e560-7e23-44dd-8db9-52f289cc5394', 'd8086d53-eee2-495f-88c5-4623c99b735d', '8aafbfca-ef06-4e09-8771-126320cb475c', '886085c0-713c-4166-8a5f-206211f15780', 'c3ce10fa-191e-44bf-9f33-d219ebddab42', '0a781675-ec01-4340-979e-13dea54578d6', '39dcd6e8-a8bc-4bf9-ac7e-15bf0917ee46', 'cd081db3-e243-46f4-9635-3fa8d8321de4', '553aa534-5138-4cad-a611-962bef5f69d1', '7cd99006-d561-4a5a-9f26-87d0fec05add', '798f05f1-d85d-40b5-be5d-45edf4d5cf18', '71d6c3a3-ddb5-47e5-9765-bc63d4bffa12', 'c2df92e3-7cac-478a-9c35-11efd20c9a27', 'edfc250b-d927-4974-9a6a-ef5ff4c4663c', '7d3fb33b-61df-434f-a918-fd3d37962d4e', 'a93dda1f-7a6d-4240-99b3-b64c5fbee747', 'd36e5022-c739-4c5a-95a2-d304e1cf8aea', '47cf5dc7-5981-4382-b9c5-f81f354340e4', 'e2564bd5-0deb-4dce-92a1-843282960ae2', 'f88098c1-e47e-4bae-a542-4aecddf22e62', '92da93a9-1816-4d1c-9276-e7262048863d', '7f47ccf9-582d-42b8-88bd-052a1d236839', 'a440aa5e-88f5-41fd-9c8a-69254c7cb93d', '0f8a4eaa-8e5f-48d8-ba58-d24fe81c9428', 'a5ca19e0-95e2-4b41-bd2b-80b7c59bd1f8', 'e02e4eed-1ec6-45c6-994b-76e613c5da09', 'fe57c7e9-ddec-4b64-9294-881c07a1b112', '00e12926-fb84-4f62-a81b-1077dafc6ada', '04987f68-d406-487d-bbdc-92ca7c5178d3', '2b50346c-0128-4dcd-b719-f9d6798bebf8', 'a2581077-ad7f-4289-9189-daacbc53b1bb', '9908b266-133b-4015-8ef1-f5d42221b7a6', '6a767f9a-20e3-42e1-a7a2-49b6c2c3ba94', 'd33ee064-ae82-459d-8b0b-225098ff5ee9', '8a934487-26dc-456e-b545-c494d828b2b2', 'f3b21a8f-e11b-4494-8615-2f524f98b64d', 'b29a8ccc-6653-46f0-93fb-4bd484b5643e', 'e361f54d-bf60-46bf-be64-51040b835383', '741c36ef-f2fa-471a-8d5f-ce12b34bbec6'];
let myChartBinding: any;

const App: React.FC = () => {
  const [bandwidthData, setBandwidthData] = useState([]);
  let chartRef = React.createRef<HTMLCanvasElement>();
  useEffect(() => {
    // cleanup previous chart
    if (myChartBinding) {
      myChartBinding.destroy();
    }
    if(chartRef.current !== null){
      const myChartRef = chartRef.current.getContext("2d");
      const formatChartData = (data: Bandwidth[]) => {
        let labels: string[] = [];
        let datasets = [];
        let ts_data: BarOptions = {
          label: "Bytes to Server",
          backgroundColor: "blue",
          data: []
        };
        let fs_data: BarOptions = {
          label: "Bytes from Server",
          backgroundColor: "red",
          data: []
        };
        for(let timeGroup of data) {
          let timeLabel = String(timeGroup.end);
          labels.push(timeLabel);
          ts_data.data.push(timeGroup.bytes_ts);
          fs_data.data.push(timeGroup.bytes_fs);
        }
        datasets.push(ts_data);
        datasets.push(fs_data);
        return {
          labels,
          datasets
        };
      };
      if(myChartRef !== null) {
        myChartBinding = new Chart(myChartRef, {
            type: "bar",
            data: formatChartData(bandwidthData)
        });
      }
    }
    return ((myChartBinding: any) => {
      // if (myChartBinding)
      //   myChartBinding.destroy();
    })(myChartBinding);
  });

  let submitForm = (values: Values) => {
    let params: ApiParams = {
      device_uuid: values.deviceId,
      window_time: values.windowTime,
      num_windows: values.numWindows
    }
    if (values.endTime) {
      params.end_time = values.endTime;
    }
    axios.get('http://localhost:5000/', {params})
    .then(function (response) {
      // handle success
      console.log(response);
      setBandwidthData(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  };
  return (
    <div className="App">
      <Formik
        initialValues={{
          deviceId: uniqueKeys[0],
          windowTime: 60,
          numWindows: 10
        }}
        onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
          submitForm(values)
        }}
        >
          {({setFieldValue}) => (
            <Form style={{textAlign: 'center'}}>
              <label htmlFor="endTime">Device Id</label>
              <Field name="deviceId" component="select" placeholder="Device Id">
                {Object.entries(uniqueKeys).map(([key, value]) => {
                  return (
                    <option value={value} key={key}>
                      {value}
                    </option>
                  );
                })}
              </Field>
              <br />
              <br />
              <Field id="endTime" name="endTime" placeholder="End Time (Now)" type="number" step="1">
                {({field} : { field: any}) => {
                  function updateValue(timestamp: number) {
                    console.log('updating end time', timestamp)
                    setFieldValue('endTime', timestamp);
                  }
                  return (
                    <div>
                      <label htmlFor="endTime">End Time&nbsp;</label>
                      <input type="number" placeholder="End Time (Now)" {...field} />
                      <br />
                      <span>Suggested: </span>
                      <button type="button" onClick={() => updateValue(1524835943)}>1524835943</button>,&nbsp;
                      <button type="button" onClick={() => updateValue(1524835873)}>1524835873</button>
                    </div>
                )}}
              </Field>
              <br />
              <br />
              <label htmlFor="windowTime">Window Timespan (in seconds)&nbsp;</label>
              <Field id="windowTime" name="windowTime" placeholder="Window Timespan" type="number" step="1"/>
              <br />
              <br />
              <label htmlFor="numWindows">Number of Time Windows&nbsp;</label>
              <Field id="numWindows" name="numWindows" placeholder="Time Windows" type="number" step="1"/>
              <br />
              <br />
              <button type="submit" style={{ display: 'inline-block' }}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <div>
          <canvas
              id="myChart"
              ref={chartRef}
          />
        </div>
    </div>
  );
}

export default App;
