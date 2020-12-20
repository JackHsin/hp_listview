import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [index, _setIndex] = useState(0);
  const indexRef = useRef(index);
  const setIndex = data => {
    indexRef.current = data;
    _setIndex(data);
  }

  function handleScroll(){
    let index = indexRef.current;

    // Fetch new data when scroll to the end
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-10) {
      fetch('/get_scenic_info?start='+index+"&end="+(index+10))
        .then(res => res.json())
        .then((info) => {
          setIndex(index+10);
          setData(oldArray => [...oldArray, ...info]);
        });
    }
  };

  useEffect(() => {
    // fetch('/scenic_info');
    fetch('/init_scenic_info?start='+index+"&end="+(index+30))
      .then(res => res.json())
      .then((info) => {
        setIndex(index+30);
        setData(info);
      });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <style>{styles}</style>

      <table >
        <tbody>
          <tr>
            <th>Region</th>
            <th>Town</th>
            <th>Name</th>
          </tr>
          {
            data.map((spot, index) => {
              return (
                <tr key={index}>
                  <td>{spot.Region}</td>
                  <td>{spot.Town}</td>
                  <td>{spot.Name}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;

const styles = `
  .App {
    text-align: center;
  }

  table, td, th {
    border: 1px solid black;
  }

  td, th {
    padding: 5px;
  }

  table {
    width: auto;
    margin: auto;
    text-align: center;
    align: center;
    border-collapse: collapse;
  }
`;