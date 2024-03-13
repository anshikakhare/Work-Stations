fetch('https://ubi-engines.azurewebsites.net/api/orchestrators/Engines')
    .then(res => res.json())
    .then(data1 => {
        // console.log('API 1:', data1);
        fetch('https://ubi-interview.azurewebsites.net/api/orchestrators/workstations')
            .then(res => res.json())
            .then(data2 => {
                // console.log('API 2:', data2);

                const mergedData = mergeData(data1, data2);
                // console.log('merged Data:', mergedData);
                populateFile(mergedData);
            }).catch(error => console.error('Error accessing data from API 2(Workstations):', error));
    }).catch(error => console.error('Error accessing data from API 1(Engines):', error));

function mergeData(data1, data2) {
    const mergedData = [];
    const mapData1 = data1.reduce((res, item) => {
        res[item.id] = item;
        return res;
    }, {});

    data2.forEach(item2 => {
        const id = item2.currentProduct?.id;
        const matchingItem1 = mapData1[id];
        if (matchingItem1) {
            mergedData.push({
                id: id,
                serialNumber: matchingItem1.serialNumber,
                model: matchingItem1.model,
                image: matchingItem1.image,
                entryTime: item2.currentProduct?.entryTime,
                assemblyName: item2.name,
                cycleTimeHrs: item2.cycleTimeHrs
            });
        } else {
            mergedData.push({
                id: null,
                serialNumber: null,
                model: null,
                image: null,
                entryTime: null,
                assemblyName: item2.name,
                cycleTimeHrs: null
            });
        }
    }); return mergedData;
}

function populateFile(data) {
    const dataContainer = document.getElementById('dataContainer');
    const boxContainer = document.createElement('div');
    boxContainer.className = 'box-container';
    dataContainer.appendChild(boxContainer);

    data.forEach((item, index) => {
        const box = document.createElement('div');
        box.className = 'box';

        const header = document.createElement('div');
        header.className = 'header';
        header.textContent = `${item.assemblyName}`;
        box.appendChild(header);

        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';

        if (item.id !== null) {
            const image = document.createElement('img');
            image.src = item.image;
            image.className = 'image';
            contentContainer.appendChild(image);

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';

            const currentTime = new Date();
            const entryTime = new Date(item.entryTime);
            const elapsedTime = currentTime - entryTime; 
            const totalTime = item.cycleTimeHrs * 60 * 60 * 1000; 
            const remainingTime = Math.max(totalTime - elapsedTime, 0); 

            const elapsedProgress = Math.min(100, (elapsedTime / totalTime) * 100);
            // const remainingProgress = Math.min(100, (remainingTime / totalTime) * 100);

            progressBar.style.width = `${elapsedProgress}%`;
            // progressBar.innerHTML = `
            //     <div class="elapsed-progress" style="width: ${elapsedProgress}%;"></div>
            //     <div class="remaining-progress" style="width: ${remainingProgress}%;"></div>`;
            contentContainer.appendChild(progressBar);

            const exceededElapsedTime = elapsedTime >totalTime;
            const exceededTime = exceededElapsedTime ? 'True' : 'False';
            const exceededTimeItem = document.createElement('div');
            exceededTimeItem.textContent = `Exceeded elapsed time? ${exceededTime}`;
            contentContainer.appendChild(exceededTimeItem);
        }

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';
        if (item.id !== null) {
            const entryTime = new Date(item.entryTime);
            const entryTimeString = entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            itemInfo.innerHTML = `
                <div class="variable-name">Serial Number:</div>
                <div class="variable-value">${item.serialNumber}</div>
                <div class="variable-name">Model:</div>
                <div class="variable-value">${item.model}</div>
                <div class="variable-name">Cycle Time (hrs):</div>
                <div class="variable-value">${item.cycleTimeHrs}</div>
                <div class="variable-name">Entry Time:</div>
                <div class="variable-value">${entryTimeString}</div>`;
        } else {
            const noProductDiv = document.createElement('div');
            noProductDiv.innerHTML = '<em>No Product</em>';
            noProductDiv.className = 'no-product';
            itemInfo.appendChild(noProductDiv);
        }
        contentContainer.appendChild(itemInfo);
        box.appendChild(contentContainer);

        boxContainer.appendChild(box);
    });
    // console.log('populated merged data.');
}
