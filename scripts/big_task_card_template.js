/**
 * creates HTML for displaying a detailed task card based on the provided task data.
 * @param {*} bigelement
 * @returns
 */
function renderBigTaskCard(bigelement) {
    return `
      <div id="big_card" class="big_card" data-task-id="${bigelement["id"]}">
        <div class="big_card_art_close">
        <div class="big_art" id="big_art_${bigelement["id"]}">${bigelement["art"]}</div>
        <div class="big_card_close" onclick="hideBigTask()"><img src="assets/img/close.svg"></div>
      </div>
  
      <div class="title_big">${bigelement["title"]}</div>
      <div class="big_description" id="big_description_${bigelement["description"]}">${bigelement["description"]}</div>
        
      <div class="big_due" id="big_due">
        <div class="big_due_date_txt" id="big_due_date_txt">Due date:</div>
        <div class="big_due_date" id="big_due_date">${formatDate(bigelement["due_date"])}</div>
      </div>
  
      <div class="big_prio">
        <div class="big_prio_txt" id="big_prio_txt">Priority:</div>
        <div class="big_prio_img" id="big_prio_img_${bigelement["id"]}"> ${bigelement["prio"]}</div>
      </div>
  
      <div class="big_assigned">
        <div class="big_assigned_txt">Assigned To:</div>
        <div class="assigned_div">${renderBigAssignedContacts(bigelement.assigned)}</div>
      </div>
  
      <div class="big_subs">
        <div class="big_subs_txt">Subtasks</div>
        <div class="subtasks_container">${renderSubtasks(bigelement.subtask, bigelement.id)}</div>
      </div>
  
      <div class="big_del_edit">
  
        <div class="big_del" onclick="deleteTask()">
  
          <div class="big_del_icon">
            <svg width="16" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 18C2.95 18 2.47917 17.8042 2.0875 17.4125C1.69583 17.0208 1.5 16.55 1.5 16V3C1.21667 3 0.979167 2.90417 0.7875 2.7125C0.595833 2.52083 0.5 2.28333 0.5 2C0.5 1.71667 0.595833 1.47917 0.7875 1.2875C0.979167 1.09583 1.21667 1 1.5 1H5.5C5.5 0.716667 5.59583 0.479167 5.7875 0.2875C5.97917 0.0958333 6.21667 0 6.5 0H10.5C10.7833 0 11.0208 0.0958333 11.2125 0.2875C11.4042 0.479167 11.5 0.716667 11.5 1H15.5C15.7833 1 16.0208 1.09583 16.2125 1.2875C16.4042 1.47917 16.5 1.71667 16.5 2C16.5 2.28333 16.4042 2.52083 16.2125 2.7125C16.0208 2.90417 15.7833 3 15.5 3V16C15.5 16.55 15.3042 17.0208 14.9125 17.4125C14.5208 17.8042 14.05 18 13.5 18H3.5ZM3.5 3V16H13.5V3H3.5ZM5.5 13C5.5 13.2833 5.59583 13.5208 5.7875 13.7125C5.97917 13.9042 6.21667 14 6.5 14C6.78333 14 7.02083 13.9042 7.2125 13.7125C7.40417 13.5208 7.5 13.2833 7.5 13V6C7.5 5.71667 7.40417 5.47917 7.2125 5.2875C7.02083 5.09583 6.78333 5 6.5 5C6.21667 5 5.97917 5.09583 5.7875 5.2875C5.59583 5.47917 5.5 5.71667 5.5 6V13ZM9.5 13C9.5 13.2833 9.59583 13.5208 9.7875 13.7125C9.97917 13.9042 10.2167 14 10.5 14C10.7833 14 11.0208 13.9042 11.2125 13.7125C11.4042 13.5208 11.5 13.2833 11.5 13V6C11.5 5.71667 11.4042 5.47917 11.2125 5.2875C11.0208 5.09583 10.7833 5 10.5 5C10.2167 5 9.97917 5.09583 9.7875 5.2875C9.59583 5.47917 9.5 5.71667 9.5 6V13Z" fill="currentColor"/>
            </svg>
          </div>
          
            <span class="delspan">Delete</span>
  
        </div>
  
          <img src="assets/img/line.svg">
  
      <div class="big_edit" onclick="editTask('${bigelement["id"]}')">
        <div class="big_edit_icon">
          <svg width="18" height="18" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 17H3.9L12.525 8.375L11.125 6.975L2.5 15.6V17ZM16.8 6.925L12.55 2.725L13.95 1.325C14.3333 0.941667 14.8042 0.75 15.3625 0.75C15.9208 0.75 16.3917 0.941667 16.775 1.325L18.175 2.725C18.5583 3.10833 18.7583 3.57083 18.775 4.1125C18.7917 4.65417 18.6083 5.11667 18.225 5.5L16.8 6.925ZM15.35 8.4L4.75 19H0.5V14.75L11.1 4.15L15.35 8.4Z" fill="currentColor"/>
          </svg>
        </div>
          <span class="editspan">Edit</span>
  
        </div>
      </div>
  
      </div>
    `;
  }