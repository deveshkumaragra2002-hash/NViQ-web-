import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="py-12 border-t border-white/5" style="background: #060810">
      <div class="max-w-[1280px] mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-7 h-7 rounded-md flex items-center justify-center"
                style="background: linear-gradient(135deg, #3B82F6, #06B6D4)">
                <span class="text-white text-xs font-extrabold">N</span>
              </div>
              <span class="text-white text-sm font-bold">NViQ</span>
            </div>
            <p class="text-[#475569] text-sm leading-relaxed">GPS fleet intelligence that turns data into profit.</p>
          </div>
          <div>
            <div class="text-white mb-3 text-sm font-semibold">Product</div>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">Features</a>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">Pricing</a>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">Analytics</a>
          </div>
          <div>
            <div class="text-white mb-3 text-sm font-semibold">Company</div>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">About</a>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">Contact</a>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">Careers</a>
          </div>
          <div>
            <div class="text-white mb-3 text-sm font-semibold">Legal</div>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">Privacy Policy</a>
            <a href="#" class="block text-[#475569] hover:text-white py-1 text-sm">Terms</a>
          </div>
          <div>
            <div class="text-white mb-3 text-sm font-semibold">Contact</div>
            <p class="text-[#475569] text-sm">NViQsupport&#64;tech.in</p>
            <p class="text-[#475569] text-sm mb-3">+91-XXXXXXXXXX</p>
            <div class="flex gap-3 text-[#475569] text-lg">
              <a href="#" class="hover:text-white">in</a>
              <a href="#" class="hover:text-white">fb</a>
              <a href="#" class="hover:text-white">ig</a>
            </div>
          </div>
        </div>
        <div class="border-t border-white/5 pt-6 text-center">
          <span class="text-[#334155] text-xs">© {{ year }} NViQ Technologies. All rights reserved.</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
