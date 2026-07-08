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
        list.innerHTML = '<div class="empty-state">Default advanced preset is active.<br>You can add more items below.</div>';
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

function updateSniperUI() {
    const type = document.getElementById('sniper-target-type').value;
    
    document.getElementById('sniper-specific-inputs').style.display = type === 'Specific' ? 'flex' : 'none';
    document.getElementById('sniper-class-inputs').style.display = type === 'All Class' ? 'block' : 'none';
    document.getElementById('sniper-rarity-inputs').style.display = type === 'All Rarity' ? 'block' : 'none';
    document.getElementById('sniper-global-inputs').style.display = type === 'Global' ? 'block' : 'none';
    document.getElementById('sniper-rap-inputs').style.display = type === 'RAP' ? 'flex' : 'none';
}

function addAdvancedSniperItem() {
    const type = document.getElementById('sniper-target-type').value;
    let finalName = "";
    let isOutside = false;
    
    if (type === 'Specific') {
        const baseName = document.getElementById('sniper-item-name').value.trim();
        if (!baseName) return flashError('sniper-item-error', 'Item Name is required.');
        
        const variation = document.getElementById('sniper-item-variation').value;
        const shiny = document.getElementById('sniper-item-shiny').checked;
        
        let prefix = "";
        if (shiny) prefix += "Shiny ";
        if (variation) prefix += variation + " ";
        
        finalName = prefix + baseName;
    } else if (type === 'All Class') {
        const val = document.getElementById('sniper-class-dropdown').value;
        finalName = "All Class: " + val;
        isOutside = true;
    } else if (type === 'All Rarity') {
        const val = document.getElementById('sniper-rarity-dropdown').value;
        finalName = "All Rarity: " + val;
        isOutside = true;
    } else if (type === 'Global') {
        finalName = document.getElementById('sniper-global-dropdown').value;
        isOutside = true;
    } else if (type === 'RAP') {
        const rapType = document.getElementById('sniper-rap-type').value;
        const amount = document.getElementById('sniper-rap-amount').value.trim();
        if (!amount) return flashError('sniper-item-error', 'Amount is required.');
        finalName = rapType + ": " + amount;
        isOutside = true;
    }
    
    const priceInput = document.getElementById('sniper-item-price').value.trim();
    if (!priceInput) return flashError('sniper-item-error', 'Price is required.');
    const allTypes = document.getElementById('sniper-item-alltypes').checked;
    
    sniperItems.push({
        name: finalName,
        price: priceInput,
        allTypes: allTypes,
        outsideTerminal: isOutside
    });
    
    document.getElementById('sniper-item-name').value = '';
    document.getElementById('sniper-rap-amount').value = '';
    document.getElementById('sniper-item-price').value = '';
    document.getElementById('sniper-item-shiny').checked = false;
    document.getElementById('sniper-item-alltypes').checked = false;
    
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

function updateSellerUI() {
    const type = document.getElementById('seller-target-type').value;
    
    document.getElementById('seller-specific-inputs').style.display = type === 'Specific' ? 'flex' : 'none';
    document.getElementById('seller-class-inputs').style.display = type === 'All Class' ? 'block' : 'none';
    document.getElementById('seller-rarity-inputs').style.display = type === 'All Rarity' ? 'block' : 'none';
    document.getElementById('seller-global-inputs').style.display = type === 'Global' ? 'block' : 'none';
    document.getElementById('seller-rap-inputs').style.display = type === 'RAP' ? 'flex' : 'none';
}

function addAdvancedSellerItem() {
    const type = document.getElementById('seller-target-type').value;
    let finalName = "";
    
    if (type === 'Specific') {
        const baseName = document.getElementById('seller-item-name').value.trim();
        if (!baseName) return flashError('seller-item-error', 'Item Name is required.');
        
        const variation = document.getElementById('seller-item-variation').value;
        const shiny = document.getElementById('seller-item-shiny').checked;
        
        let prefix = "";
        if (shiny) prefix += "Shiny ";
        if (variation) prefix += variation + " ";
        
        finalName = prefix + baseName;
    } else if (type === 'All Class') {
        const val = document.getElementById('seller-class-dropdown').value;
        finalName = "All Class: " + val;
    } else if (type === 'All Rarity') {
        const val = document.getElementById('seller-rarity-dropdown').value;
        finalName = "All Rarity: " + val;
    } else if (type === 'Global') {
        finalName = document.getElementById('seller-global-dropdown').value;
    } else if (type === 'RAP') {
        const rapType = document.getElementById('seller-rap-type').value;
        const amount = document.getElementById('seller-rap-amount').value.trim();
        if (!amount) return flashError('seller-item-error', 'Amount is required.');
        finalName = rapType + ": " + amount;
    }
    
    const priceInput = document.getElementById('seller-item-price').value.trim();
    if (!priceInput) return flashError('seller-item-error', 'Price is required.');
    
    const amountInput = document.getElementById('seller-item-amount');
    const allTypes = document.getElementById('seller-item-alltypes').checked;
    const priority = document.getElementById('seller-item-priority').checked;
    
    sellerItems.push({
        name: finalName,
        price: priceInput,
        amount: amountInput.value.trim() !== '' ? parseInt(amountInput.value) : null,
        allTypes: allTypes,
        priority: priority
    });
    
    document.getElementById('seller-item-name').value = '';
    document.getElementById('seller-rap-amount').value = '';
    document.getElementById('seller-item-price').value = '';
    document.getElementById('seller-item-amount').value = '';
    document.getElementById('seller-item-shiny').checked = false;
    document.getElementById('seller-item-alltypes').checked = false;
    document.getElementById('seller-item-priority').checked = false;
    
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
    const scriptKey = document.getElementById('script-key').value.trim();
    let lua = `getgenv().SCRIPT_KEY = "${scriptKey}"\n\n`;
    lua += `getgenv().Settings = {\n`;

    const sniperActive = document.getElementById('sniper-active').checked;
    lua += `    Sniper = {\n`;
    lua += `        Active = ${sniperActive},\n`;
    lua += `        Items = {\n`;
    lua += `            SearchTerminal = {\n`;
    lua += `                "Search Items via Trading Terminal, Custom Keywords NOT supported here.",\n`;

    const terminalItems = sniperItems.filter(item => !item.outsideTerminal);
    const globalItems = sniperItems.filter(item => item.outsideTerminal);

    terminalItems.forEach((item, idx) => {
        let propsStr = item.customProps;
        if (!propsStr) {
            let props = [`Price = ${toLuaVal(item.price)}`];
            if (item.allTypes) props.push(`AllTypes = true`);
            propsStr = props.join(', ');
        }
        lua += `                ["${item.name}"] = { ${propsStr} }${idx < terminalItems.length - 1 ? ',' : ''}\n`;
    });

    lua += `            },\n`;
    
    globalItems.forEach((item, idx) => {
        let propsStr = item.customProps;
        if (!propsStr) {
            let props = [`Price = ${toLuaVal(item.price)}`];
            if (item.allTypes) props.push(`AllTypes = true`);
            propsStr = props.join(', ');
        }
        lua += `            ["${item.name}"] = { ${propsStr} }${idx < globalItems.length - 1 ? ',' : ''}\n`;
    });

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

    lua += `loadstring(game:HttpGet("https://raw.githubusercontent.com/Xranbfg132/PetSim99Plaza/refs/heads/main/FREE"))()`;

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

function initCustomSelects() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        if (select.nextElementSibling && select.nextElementSibling.classList.contains('custom-select-wrapper')) return;
        
        select.style.display = 'none';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        
        const textSpan = document.createElement('span');
        if (select.options.length > 0) {
            textSpan.textContent = select.options[select.selectedIndex].text;
        }
        
        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        
        trigger.appendChild(textSpan);
        trigger.appendChild(arrow);
        
        const optionsList = document.createElement('div');
        optionsList.className = 'custom-options';
        
        Array.from(select.options).forEach(option => {
            const opt = document.createElement('div');
            opt.className = 'custom-option';
            if (option.selected) opt.classList.add('selected');
            opt.textContent = option.text;
            
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                select.value = option.value;
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                
                textSpan.textContent = option.text;
                optionsList.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                
                wrapper.classList.remove('open');
                trigger.classList.remove('active');
            });
            optionsList.appendChild(opt);
        });
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if (w !== wrapper) {
                    w.classList.remove('open');
                    w.querySelector('.custom-select-trigger').classList.remove('active');
                }
            });
            wrapper.classList.toggle('open');
            trigger.classList.toggle('active');
        });
        
        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsList);
        
        select.parentNode.insertBefore(wrapper, select.nextSibling);
        
        select.addEventListener('change', () => {
            if (select.selectedIndex >= 0) {
                const selectedOpt = select.options[select.selectedIndex];
                textSpan.textContent = selectedOpt.text;
                optionsList.querySelectorAll('.custom-option').forEach(o => {
                    o.classList.remove('selected');
                    if (o.textContent === selectedOpt.text) o.classList.add('selected');
                });
            }
        });
    });
    
    document.addEventListener('click', function() {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => {
            w.classList.remove('open');
            if(w.querySelector('.custom-select-trigger')) {
                w.querySelector('.custom-select-trigger').classList.remove('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    sniperItems.push({ name: "Nice Egg", price: "5%", allTypes: false, customProps: 'Price = "5%", InventoryLimit = 355' });
    sniperItems.push({ name: "Huge Night Terror Cat", price: "50%", allTypes: false, customProps: 'Price = "50%", UseCosmicValues = true' });
    sniperItems.push({ name: "All Class: Misc", price: "5", allTypes: false, customProps: 'Price = 5', outsideTerminal: true });
    sniperItems.push({ name: "All Rarity: Celestial", price: "50%", allTypes: false, customProps: 'Price = "50%"', outsideTerminal: true });
    sniperItems.push({ name: "Shiny Rainbow Broomstick Cat", price: "+2%", allTypes: false, customProps: 'Price = "+2%"', outsideTerminal: true });
    sniperItems.push({ name: "All Huges", price: "15m", allTypes: true, customProps: 'Price = "15m", DetectManipulation = true, AllTypes = true', outsideTerminal: true });
    renderSniperItems();

    sellerItems.push({ name: "All Huges", price: "+20%", amount: null, allTypes: true, priority: false });
    sellerItems.push({ name: "Rainbow Cat", price: "1b", amount: 5, allTypes: false, priority: false });
    sellerItems.push({ name: "Coins Potion 5", price: "5", amount: null, allTypes: false, priority: true });
    renderSellerItems();

    enterKeySubmits(['sniper-item-name', 'sniper-rap-amount', 'sniper-item-price'], addAdvancedSniperItem);
    enterKeySubmits(['seller-item-name', 'seller-rap-amount', 'seller-item-price', 'seller-item-amount'], addAdvancedSellerItem);

    initCustomSelects();
});
