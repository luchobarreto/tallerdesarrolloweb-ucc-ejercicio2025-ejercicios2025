const sumNum1 = document.getElementById('nums1');
const sumNum2 = document.getElementById('nums2');
const totalSum = document.getElementById('totalS');

const subNum1 = document.getElementById('numr1');
const subNum2 = document.getElementById('numr2');
const totalSub = document.getElementById('totalR');

const mulNum1 = document.getElementById('numm1');
const mulNum2 = document.getElementById('numm2');
const totalMul = document.getElementById('totalM');

const divNum1 = document.getElementById('numd1');
const divNum2 = document.getElementById('numd2');
const totalDiv = document.getElementById('totalD');

let sumValue1 = null;
let sumValue2 = null;

let subValue1 = null;
let subValue2 = null;

let mulValue1 = null;
let mulValue2 = null;

let divValue1 = null;
let divValue2 = null;

const numberRegex = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;

const generateInnerHtml = (value) => `
    <span>${value}</span>
`;

const checkValidity = (raw, element, totalElement) => {
    const s = String(raw).trim();
    if (s === "" || !numberRegex.test(s)) {
        alert("Solo se permiten valores numericos");
        element.value = "";
        if (totalElement) totalElement.innerHTML = "";
        return false;
    }
    const n = parseFloat(s);
    if (!Number.isFinite(n)) {
        alert("Solo se permiten valores numericos");
        element.value = "";
        if (totalElement) totalElement.innerHTML = "";
        return false;
    }
    return true;
}

sumNum1.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, sumNum1, totalSum)) {
        sumValue1 = parseFloat(raw);
        if (sumValue2 !== null) totalSum.innerHTML = generateInnerHtml(sumValue1 + sumValue2);
        else totalSum.innerHTML = "";
    } else {
        sumValue1 = null;
    }
});

sumNum2.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, sumNum2, totalSum)) {
        sumValue2 = parseFloat(raw);
        if (sumValue1 !== null) totalSum.innerHTML = generateInnerHtml(sumValue1 + sumValue2);
        else totalSum.innerHTML = "";
    } else {
        sumValue2 = null;
    }
});

subNum1.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, subNum1, totalSub)) {
        subValue1 = parseFloat(raw);
        if (subValue2 !== null) totalSub.innerHTML = generateInnerHtml(subValue1 - subValue2);
        else totalSub.innerHTML = "";
    } else {
        subValue1 = null;
    }
});

subNum2.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, subNum2, totalSub)) {
        subValue2 = parseFloat(raw);
        if (subValue1 !== null) totalSub.innerHTML = generateInnerHtml(subValue1 - subValue2);
        else totalSub.innerHTML = "";
    } else {
        subValue2 = null;
    }
});

mulNum1.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, mulNum1, totalMul)) {
        mulValue1 = parseFloat(raw);
        if (mulValue2 !== null) totalMul.innerHTML = generateInnerHtml(mulValue1 * mulValue2);
        else totalMul.innerHTML = "";
    } else {
        mulValue1 = null;
    }
});

mulNum2.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, mulNum2, totalMul)) {
        mulValue2 = parseFloat(raw);
        if (mulValue1 !== null) totalMul.innerHTML = generateInnerHtml(mulValue1 * mulValue2);
        else totalMul.innerHTML = "";
    } else {
        mulValue2 = null;
    }
});

divNum1.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, divNum1, totalDiv)) {
        divValue1 = parseFloat(raw);
        if (divValue2 !== null) {
            totalDiv.innerHTML = generateInnerHtml(divValue1 / divValue2);
        } else {
            totalDiv.innerHTML = "";
        }
    } else {
        divValue1 = null;
    }
});

divNum2.addEventListener('change', (e) => {
    const raw = e.target.value;
    if (checkValidity(raw, divNum2, totalDiv)) {
        divValue2 = parseFloat(raw);
        if (divValue1 !== null) {
            if (divValue2 === 0) {
                alert("No se puede dividir por cero");
                divNum2.value = "";
                totalDiv.value = "";
                divValue2 = null;
            } else {
                totalDiv.innerHTML = generateInnerHtml(divValue1 / divValue2);
            }
        } else {
            totalDiv.innerHTML = "";
        }
    } else {
        divValue2 = null;
    }
});
