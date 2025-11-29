
```html
<body>
  <fieldset id="printStyle">
  <legend>
    Click Print. The page will be laid out in the defined orientation.
  </legend>
  <button id="print">Print</button>
</fieldset>
<div id="print-area">
  <section class="upright">
    <h2>Section in Portrait/Upright</h2>
    <p>This section will be printed in portrait and upright with:</p>
    <pre>
        .upright {
            size: portrait;
            page-orientation: upright;
        }
    </pre>
    <p>Paragraph one.</p>
    <p>Paragraph two.</p>
  </section>
  <section class="left">
    <h2>Section in Landscape/Left</h2>
    <p>This section will be printed in landscape and rotated left with:</p>
    <pre>
        .left {
            size: landscape;
            page-orientation: rotate-left;
        }
    </pre>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>100m</th>
          <th>1500m</th>
          <th>Hurdles</th>
          <th>Long Jump</th>
          <th>High Jump</th>
          <th>Javelin</th>
          <th>Discus</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Dave</th>
          <td>9.65</td>
          <td>3:49</td>
          <td>12.64</td>
          <td>8.54m</td>
          <td>1.95m</td>
          <td>56.65m</td>
          <td>47.63m</td>
        </tr>
        <tr>
          <th>Simon</th>
          <td>9.87</td>
          <td>3:52</td>
          <td>11.89</td>
          <td>8.16m</td>
          <td>1.96m</td>
          <td>59.03m</td>
          <td>45.72m</td>
        </tr>
        <tr>
          <th>Fred</th>
          <td>9.67</td>
          <td>3:52</td>
          <td>12.03</td>
          <td>8.04m</td>
          <td>2.01m</td>
          <td>62.58m</td>
          <td>46.83m</td>
        </tr>
        <tr>
          <th>Gary</th>
          <td>9.77</td>
          <td>3:56</td>
          <td>13.04</td>
          <td>7.96m</td>
          <td>2.02m</td>
          <td>63.87m</td>
          <td>47.73m</td>
        </tr>
        <tr>
          <th>Dick</th>
          <td>9.95</td>
          <td>3:44</td>
          <td>12.99</td>
          <td>5.66m</td>
          <td>1.97m</td>
          <td>56.43m</td>
          <td>43.87m</td>
        </tr>
        <tr>
          <th>Tom</th>
          <td>9.84</td>
          <td>3:48</td>
          <td>12.86</td>
          <td>6.87m</td>
          <td>1.95m</td>
          <td>67.03m</td>
          <td>42.73m</td>
        </tr>
        <tr>
          <th>Harry</th>
          <td>9.91</td>
          <td>3:53</td>
          <td>13.77</td>
          <td>7.34m</td>
          <td>1.94m</td>
          <td>62.84m</td>
          <td>46.72m</td>
        </tr>
      </tbody>
    </table>
  </section>
  <section class="right">
    <h2>Section in Landscape/Right</h2>
    <p>This section will be printed in landscape and rotated right with:</p>
    <pre>
        .right {
            size: landscape;
            page-orientation: rotate-right;
        }
    </pre>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>100m</th>
          <th>1500m</th>
          <th>Hurdles</th>
          <th>Long Jump</th>
          <th>High Jump</th>
          <th>Javelin</th>
          <th>Discus</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Dave</th>
          <td>9.65</td>
          <td>3:49</td>
          <td>12.64</td>
          <td>8.54m</td>
          <td>1.95m</td>
          <td>56.65m</td>
          <td>47.63m</td>
        </tr>
        <tr>
          <th>Simon</th>
          <td>9.87</td>
          <td>3:52</td>
          <td>11.89</td>
          <td>8.16m</td>
          <td>1.96m</td>
          <td>59.03m</td>
          <td>45.72m</td>
        </tr>
        <tr>
          <th>Fred</th>
          <td>9.67</td>
          <td>3:52</td>
          <td>12.03</td>
          <td>8.04m</td>
          <td>2.01m</td>
          <td>62.58m</td>
          <td>46.83m</td>
        </tr>
        <tr>
          <th>Gary</th>
          <td>9.77</td>
          <td>3:56</td>
          <td>13.04</td>
          <td>7.96m</td>
          <td>2.02m</td>
          <td>63.87m</td>
          <td>47.73m</td>
        </tr>
        <tr>
          <th>Dick</th>
          <td>9.95</td>
          <td>3:44</td>
          <td>12.99</td>
          <td>5.66m</td>
          <td>1.97m</td>
          <td>56.43m</td>
          <td>43.87m</td>
        </tr>
        <tr>
          <th>Tom</th>
          <td>9.84</td>
          <td>3:48</td>
          <td>12.86</td>
          <td>6.87m</td>
          <td>1.95m</td>
          <td>67.03m</td>
          <td>42.73m</td>
        </tr>
        <tr>
          <th>Harry</th>
          <td>9.91</td>
          <td>3:53</td>
          <td>13.77</td>
          <td>7.34m</td>
          <td>1.94m</td>
          <td>62.84m</td>
          <td>46.72m</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>

<script type="">
    const printButton = document.querySelector("#print");
    printButton.addEventListener("click", () => {
        window.print();
    });
</script>
<script>
    try {
    window.parent.postMessage({ typ: "ready" }, "*");
    } catch (e) {
    console.error("[Playground] Failed to post ready message", e);
    }
</script>

</body>
```
