/* ====== Customization Modal ====== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.16);
  background: #CFB857;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #111111;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #111111;
}

.modal-close:hover {
  background: rgba(0,0,0,0.1);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.option-section {
  margin-bottom: 24px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 16px;
  background: #fafafa;
}

.option-section:last-child {
  margin-bottom: 0;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.option-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #111111;
}

.option-requirements {
  display: flex;
  gap: 8px;
}

.required-badge {
  background: #C7372F;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.multi-select-badge {
  background: #111111;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.max-toppings-badge {
  background: #2F80ED;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.option-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.choice-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(0,0,0,0.16);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.choice-label:hover {
  border-color: #111111;
  background: #f9f9f9;
}

.choice-label.selected {
  border-color: #CFB857;
  background: rgba(207, 184, 87, 0.1);
}

.choice-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.choice-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.choice-name {
  flex: 1;
}

.choice-price {
  color: #C7372F;
  font-weight: 600;
  font-size: 13px;
  min-width: 60px;
  text-align: right;
}

.choice-free {
  color: #27AE60;
  font-weight: 600;
  font-size: 13px;
  min-width: 60px;
  text-align: right;
}

/* Toppings grid layout for free toppings */
.toppings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.topping-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border: 1px solid rgba(0,0,0,0.16);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  text-align: center;
}

.topping-label:hover {
  border-color: #111111;
  background: #f9f9f9;
}

.topping-label.selected {
  border-color: #CFB857;
  background: rgba(207, 184, 87, 0.1);
}

.topping-abbr {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.topping-fullname {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
}

.topping-free-badge {
  background: #27AE60;
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
}

/* Selection counter */
.selection-counter {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  text-align: right;
}

.selection-counter.warning {
  color: #C7372F;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid rgba(0,0,0,0.16);
  background: #f9f9f9;
}

.modal-price {
  font-size: 20px;
  font-weight: 700;
  color: #111111;
}

.modal-add-btn {
  background: #C7372F;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
  min-width: 120px;
}

.modal-add-btn:hover {
  background: #a52e27;
}

.modal-add-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* Customizations display in cart */
.customizations {
  margin-top: 8px;
}

.customization-line {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 2px;
  line-height: 1.3;
}

.customization-line strong {
  font-weight: 600;
}

/* Section-specific styling */
.bread-section {
  background: rgba(207, 184, 87, 0.05);
  border-color: #CFB857;
}

.free-toppings-section {
  background: rgba(39, 174, 96, 0.05);
  border-color: #27AE60;
}

.paid-toppings-section {
  background: rgba(199, 55, 47, 0.05);
  border-color: #C7372F;
}

/* Mobile responsive for modal */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .option-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .option-requirements {
    align-self: flex-start;
  }
  
  .toppings-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .modal-price {
    text-align: center;
  }
  
  .modal-add-btn {
    width: 100%;
  }
}

/* Ensure modal works on very small screens */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 5px;
  }
  
  .choice-label {
    padding: 10px;
  }
  
  .topping-label {
    padding: 8px 6px;
  }
  
  .choice-text {
    font-size: 13px;
  }
  
  .toppings-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .topping-fullname {
    font-size: 11px;
  }
}
