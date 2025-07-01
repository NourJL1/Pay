import { Component } from '@angular/core';

@Component({
  selector: 'app-profiling',
  imports: [],
  templateUrl: './profiling.component.html',
  styleUrl: './profiling.component.css'
})
export class ProfilingComponent {

  

showTab(tabId: string, tabType ?: string): void {

  const buttonClass = tabType ? `${tabType}-tab-button` : 'tab-button';
  const contentClass = tabType ? `${tabType}-tab-content` : 'tab-content';
  const tabButtons = document.querySelectorAll(`.${buttonClass}`);
  const tabContents = document.querySelectorAll(`.${contentClass}`);

  // Reset all buttons and contents
  tabButtons.forEach(btn => {
    btn.classList.remove('active', 'text-primary', 'font-medium');
    btn.classList.add('text-gray-500');
  });

  tabContents.forEach(content => content.classList.add('hidden'));

  // Activate the clicked button and show its tab content
  const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
  activeButton?.classList.add('active', 'text-primary', 'font-medium');
  activeButton?.classList.remove('text-gray-500');

  const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
  const activeContent = document.getElementById(activeId);
  activeContent?.classList.remove('hidden');
}

}
