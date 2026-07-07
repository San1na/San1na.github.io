let sniperItems = [];
let sellerItems = [];

function flashError(elId, message) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (message) el.textContent = message;
    el.classList.add('visible');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.classList.remove('visible'), 2600);
}

function enterKeySubmits(inputIds, callback) {
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                callback();
            }
        });
    });
}

function renderSniperItems() {
    const list = document.getElementById('sniper-items-list');
    list.innerHTML = '';

    if (sniperItems.length === 0) {
        list.innerHTML = '<div class="empty-state">No items added yet.</div>';
    }

    sniperItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-tag">${item.price}</span>
                ${item.allTypes ? '<span class="item-tag">All Types</span>' : ''}
            </div>
            <button class="btn-remove" onclick="removeSniperItem(${index})" aria-label="Remove ${item.name}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        list.appendChild(row);
    });
}

function addSniperItem() {
    const nameInput = document.getElementById('sniper-item-name');
    const priceInput = document.getElementById('sniper-item-price');
    const allTypesInput = document.getElementById('sniper-item-alltypes');

    if (!nameInput.value.trim() || !priceInput.value.trim()) {
        flashError('sniper-item-error', 'Name and price are required.');
        return;
    }

    sniperItems.push({
        name: nameInput.value.trim(),
        price: priceInput.value.trim(),
        allTypes: allTypesInput.checked
    });

    nameInput.value = '';
    priceInput.value = '';
    allTypesInput.checked = false;
    nameInput.focus();
    renderSniperItems();
}

function removeSniperItem(index) {
    sniperItems.splice(index, 1);
    renderSniperItems();
}

function renderSellerItems() {
    const list = document.getElementById('seller-items-list');
    list.innerHTML = '';

    if (sellerItems.length === 0) {
        list.innerHTML = '<div class="empty-state">No items added yet.</div>';
    }

    sellerItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'item-row';
        let tags = `<span class="item-tag">${item.price}</span>`;
        if (item.amount) tags += `<span class="item-tag">×${item.amount}</span>`;
        if (item.allTypes) tags += `<span class="item-tag">All Types</span>`;
        if (item.priority) tags += `<span class="item-tag">Priority</span>`;

        row.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                ${tags}
            </div>
            <button class="btn-remove" onclick="removeSellerItem(${index})" aria-label="Remove ${item.name}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        list.appendChild(row);
    });
}

function addSellerItem() {
    const nameInput = document.getElementById('seller-item-name');
    const priceInput = document.getElementById('seller-item-price');
    const amountInput = document.getElementById('seller-item-amount');
    const allTypesInput = document.getElementById('seller-item-alltypes');
    const priorityInput = document.getElementById('seller-item-priority');

    if (!nameInput.value.trim() || !priceInput.value.trim()) {
        flashError('seller-item-error', 'Name and price are required.');
        return;
    }

    sellerItems.push({
        name: nameInput.value.trim(),
        price: priceInput.value.trim(),
        amount: amountInput.value.trim() !== '' ? parseInt(amountInput.value) : null,
        allTypes: allTypesInput.checked,
        priority: priorityInput.checked
    });

    nameInput.value = '';
    priceInput.value = '';
    amountInput.value = '';
    allTypesInput.checked = false;
    priorityInput.checked = false;
    nameInput.focus();
    renderSellerItems();
}

function removeSellerItem(index) {
    sellerItems.splice(index, 1);
    renderSellerItems();
}

function toLuaVal(val) {
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'number') return val;
    if (val === null || val === undefined) return 'nil';

    if (!isNaN(val) && !isNaN(parseFloat(val))) return val;

    return `"${val}"`;
}

function generateConfig() {
    let lua = `getgenv().Settings = {\n`;

    const sniperActive = document.getElementById('sniper-active').checked;
    lua += `    Sniper = {\n`;
    lua += `        Active = ${sniperActive},\n`;
    lua += `        Items = {\n`;
    lua += `            SearchTerminal = {\n`;
    lua += `                "Search Items via Trading Terminal, Custom Keywords NOT supported here.",\n`;

    sniperItems.forEach((item, idx) => {
        let props = [];
        props.push(`Price = ${toLuaVal(item.price)}`);
        if (item.allTypes) props.push(`AllTypes = true`);

        lua += `                ["${item.name}"] = { ${props.join(', ')} }${idx < sniperItems.length - 1 ? ',' : ''}\n`;
    });

    lua += `            }\n`;
    lua += `        },\n`;

    const snSwitchAct = document.getElementById('sniper-switch-active').checked;
    const snSwitchDel = document.getElementById('sniper-switch-delay').value || 4;
    const snSwitchPro = document.getElementById('sniper-switch-pro').checked;
    lua += `        ["Switch Servers"] = { Active = ${snSwitchAct}, SecondDelay = ${snSwitchDel}, OnlyPRO = ${snSwitchPro} },\n`;

    const snWebAct = document.getElementById('sniper-webhook-active').checked;
    const snWebUrl = document.getElementById('sniper-webhook-url').value;
    lua += `        ["Webhook"] = { Active = ${snWebAct}, URL = "${snWebUrl}" },\n`;

    lua += `        ["Kill Switch"] = {\n`;
    let ksLines = [];
    ksLines.push(`            ["Limits Reached"] = ${document.getElementById('ks-sniper-limits').checked}`);
    ksLines.push(`            ["^^^ Switch To Selling"] = ${document.getElementById('ks-sniper-switch-selling').checked}`);
    
    if (document.getElementById('ks-sniper-60m').checked) {
        let mins = document.getElementById('val-sniper-timer').value || "60";
        ksLines.push(`            ["${mins} Minutes Timer"] = true`);
    } else {
        ksLines.push(`            ["60 Minutes Timer"] = false`);
    }

    if (document.getElementById('ks-sniper-gems').checked) {
        let gems = document.getElementById('val-sniper-gems').value || "25m";
        ksLines.push(`            ["Diamonds Hit: ${gems}"] = true`);
    } else {
        ksLines.push(`            ["Diamonds Hit: 25m"] = false`);
    }

    ksLines.push(`            ["Disconnect on Error"] = ${document.getElementById('ks-sniper-disconnect').checked}`);
    
    lua += ksLines.join(',\n') + '\n';
    lua += `        }\n`;
    lua += `    },\n\n`;

    const sellerActive = document.getElementById('seller-active').checked;
    lua += `    Seller = {\n`;
    lua += `        Active = ${sellerActive},\n`;
    lua += `        Items = {\n`;

    sellerItems.forEach((item, idx) => {
        let props = [];
        props.push(`Price = ${toLuaVal(item.price)}`);
        if (item.amount !== null) props.push(`Amount = ${item.amount}`);
        if (item.allTypes) props.push(`AllTypes = true`);
        if (item.priority) props.push(`Priority = true`);

        lua += `            ["${item.name}"] = { ${props.join(', ')} }${idx < sellerItems.length - 1 ? ',' : ''}\n`;
    });

    lua += `        },\n`;

    const slSwitchAct = document.getElementById('seller-switch-active').checked;
    const slSwitchDel = document.getElementById('seller-switch-delay').value || 20;
    const slSwitchPro = document.getElementById('seller-switch-pro').checked;
    lua += `        ["Switch Servers"] = { Active = ${slSwitchAct}, MinuteDelay = ${slSwitchDel}, OnlyPRO = ${slSwitchPro} },\n`;

    const slWebAct = document.getElementById('seller-webhook-active').checked;
    const slWebUrl = document.getElementById('seller-webhook-url').value;
    lua += `        ["Webhook"] = { Active = ${slWebAct}, URL = "${slWebUrl}" },\n`;

    lua += `        ["Kill Switch"] = {\n`;
    let ksSellerLines = [];
    ksSellerLines.push(`            ["Booth Runout"] = ${document.getElementById('ks-seller-booth').checked}`);
    ksSellerLines.push(`            ["^^^ Switch To Sniping"] = ${document.getElementById('ks-seller-switch-sniping').checked}`);
    
    if (document.getElementById('ks-seller-60m').checked) {
        let mins = document.getElementById('val-seller-timer').value || "60";
        ksSellerLines.push(`            ["${mins} Minutes Timer"] = true`);
    } else {
        ksSellerLines.push(`            ["60 Minutes Timer"] = false`);
    }

    if (document.getElementById('ks-seller-gems').checked) {
        let gems = document.getElementById('val-seller-gems').value || "1b";
        ksSellerLines.push(`            ["Diamonds Hit: ${gems}"] = true`);
    } else {
        ksSellerLines.push(`            ["Diamonds Hit: 1b"] = false`);
    }

    ksSellerLines.push(`            ["Disconnect on Error"] = ${document.getElementById('ks-seller-disconnect').checked}`);

    lua += ksSellerLines.join(',\n') + '\n';
    lua += `        },\n`;

    const sendAct = document.getElementById('seller-sendout-active').checked;
    const sendUser = document.getElementById('seller-sendout-user').value;
    const sendAmt = document.getElementById('seller-sendout-amount').value || "1b";
    lua += `        ["Diamonds Sendout"] = { Active = ${sendAct}, Username = "${sendUser}", Amount = "${sendAmt}" }\n`;

    lua += `    }\n`;
    lua += `}\n\n`;

    lua += `loadstring(game:HttpGet("https://raw.githubusercontent.com/San1na/NLS/refs/heads/main/NLS.luau"))()`;

    document.getElementById('output-code').value = lua;
    document.getElementById('output-code').scrollTop = 0;
}

function copyToClipboard() {
    const output = document.getElementById('output-code');
    if (!output.value) return;

    output.select();
    document.execCommand('copy');

    const btn = document.getElementById('copy-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Copied!';
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    sniperItems.push({ name: "All Titanics", price: "4b", allTypes: true });
    sniperItems.push({ name: "Origami Shark", price: "22m", allTypes: false });
    sniperItems.push({ name: "Mars Monkey", price: "22m", allTypes: false });
    sniperItems.push({ name: "Ghostly Bunny", price: "22m", allTypes: false });
    renderSniperItems();

    sellerItems.push({ name: "All Huges", price: "+20%", amount: null, allTypes: true, priority: false });
    sellerItems.push({ name: "Rainbow Cat", price: "1b", amount: 5, allTypes: false, priority: false });
    sellerItems.push({ name: "Coins Potion 5", price: "5", amount: null, allTypes: false, priority: true });
    renderSellerItems();

    enterKeySubmits(['sniper-item-name', 'sniper-item-price'], addSniperItem);
    enterKeySubmits(['seller-item-name', 'seller-item-price', 'seller-item-amount'], addSellerItem);
});
